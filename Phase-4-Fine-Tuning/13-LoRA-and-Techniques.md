# 13. Fine-Tuning Techniques: Full vs PEFT vs LoRA vs QLoRA

## The Problem: Full Fine-Tuning is Expensive

**Full fine-tuning** = retrain all parameters of the model.

```
GPT-3 (175B parameters):
├─ Storing weights: 175B × 4 bytes = 700GB GPU RAM needed
├─ Training: 7-14 days on 100 GPUs
├─ Cost: $1M+
└─ Not practical for anyone!

GPT-4 sized model:
├─ Storing weights: 1T+ parameters
├─ Cost: Even more impractical!
└─ ❌ Not an option
```

**Solution: Don't retrain all parameters. Train only a few.**

This is **PEFT** = Parameter-Efficient Fine-Tuning.

---

## PEFT: The Idea

Instead of updating all parameters, update only **a small subset**.

```
Full fine-tuning:
├─ Trainable parameters: All 175B parameters
├─ Memory needed: 700GB
├─ Training cost: $1M

PEFT fine-tuning:
├─ Trainable parameters: ~1-10M (0.001% of total!)
├─ Memory needed: 50GB (10x smaller!)
├─ Training cost: $100-1000
└─ Performance: Often 90% as good as full fine-tuning!
```

---

## LoRA (Low-Rank Adaptation)

**LoRA** is the most popular PEFT technique.

### The Concept

Instead of updating weight matrix $W$, add a small perturbation:

```
Traditional:          LoRA:
Output = W × Input    Output = (W + ΔW) × Input

Where:
W = original weights (large, frozen)
ΔW = small update (trainable, low-rank)
```

### How it works conceptually

Imagine a weight matrix:

```
Full weight matrix W (1000 × 1000):
W = [w11 w12 ... w1000
     w21 w22 ...
     ...
     w1000 ... w1000000]

Total params: 1,000,000

LoRA approach:
Create two small matrices:
A = (1000 × rank)  where rank = 8
B = (rank × 1000)

Trainable params in A + B: 1000×8 + 8×1000 = 16,000
(only 1.6% of original!)

The update: ΔW = A @ B  (matrix multiplication)

During forward pass:
Output = W @ Input + (A @ B) @ Input
         ↑original    ↑ small update
```

### Why it works

```
Key insight: The update (LoRA) might be low-rank!

Analogy:
└─ Imagine updating a book by writing small notes in margins
   instead of rewriting the whole book
   └─ The notes capture the key changes
   └─ The full text (book) provides context
```

---

## LoRA in Practice

### Benefits

✅ **Tiny footprint:** 1-10M trainable params vs 175B
✅ **Fast training:** 1 GPU instead of 100
✅ **Cheap:** $100-500 instead of $1M
✅ **Can fine-tune for multiple domains:** Train 5 LoRAs, each 100MB, swap at inference
✅ **Works well:** Often 85-95% as good as full fine-tuning

### Trade-offs

❌ **Slightly lower accuracy:** 95% → 92% (depends on task)
❌ **Rank parameter:** Must choose (rank=8 vs rank=64 → different accuracy/cost)
❌ **Only works on certain layers:** Attachment points matter

### Example: Fine-tuning Llama-7B with LoRA

```
Standard fine-tuning:
├─ Params: 7B
├─ GPU RAM: 56GB
├─ Cost: $500
└─ Time: 3 days

With LoRA (rank=8):
├─ Trainable params: ~3.7M
├─ GPU RAM: 16GB (can use consumer GPU!)
├─ Cost: $50
└─ Time: 3 hours

Accuracy:
├─ Full fine-tune: 92%
├─ LoRA fine-tune: 91%
└─ Trade-off: worth it!
```

---

## QLoRA (Quantized LoRA)

**QLoRA** = LoRA + Quantization

Quantization = compress weights to lower precision.

```
Weight storage:
├─ Full precision (float32): 4 bytes per weight
├─ Half precision (float16): 2 bytes per weight
├─ Quantized (int8): 1 byte per weight
└─ Extreme (int4): 0.5 bytes per weight

Model size comparison:
├─ GPT-3 (float32): 700GB
├─ GPT-3 (int4): 87GB  (8x smaller!)
├─ Llama-7B (float32): 56GB
├─ Llama-7B (int4): 7GB (consumer GPU possible!)
```

### How QLoRA works

```
Process:
1. Load model in int4 (quantized, 7GB)
2. Apply LoRA lightly (add 3.7M trainable params)
3. Train on small dataset
4. Merge LoRA weights back

Benefits:
├─ Can fine-tune 7B model on RTX 4090 (24GB) or even RTX 3090 (24GB)!
├─ Cost: Near-free (just your GPU)
├─ Time: 6-12 hours for decent results
└─ Accuracy: 88-92% (slightly lower than LoRA)

Trade-off:
└─ Accuracy drops a bit more, but training becomes accessible!
```

### Real example

```
Llama-7B Q-LoRA fine-tuning:

Hardware: RTX 4090 (24GB VRAM)
Dataset: 1000 training examples
Rank: 16 (medium)
Result after 6 hours:
├─ Zero-shot accuracy: 65%
├─ Fine-tuned accuracy: 78%
└─ Not as good as full fine-tune (82%), but good enough!

Cost: $0 (your GPU)
Timeline: 6 hours
```

---

## Comparison Table

| Method | Trainable Params | GPU RAM | Cost | Training Time | Accuracy | Use Case |
|---|---|---|---|---|---|---|
| **Full Fine-tune** | 175B | 700GB | $1M+ | 7-14 days | 95%+ | Research lab |
| **LoRA** | 3.7M | 50GB | $500 | 2-3 days | 92% | Most practical use |
| **QLoRA** | 3.7M | 16GB | $50-100 | 6-12 hrs | 88% | Constrained resources |
| **Prompting** | 0 | - | $0 | 1hr | 60-75% | Quick prototyping |

---

## Choosing Rank in LoRA

The **rank** parameter controls size/accuracy trade-off.

```
Rank = 8 (tiny):
├─ Params: 1.6M
├─ Memory: 12GB
├─ Accuracy: 85%
└─ Good for: Quick experiments, deployment

Rank = 16 (default):
├─ Params: 3.7M
├─ Memory: 16GB
├─ Accuracy: 90%
└─ Good for: Production, balanced

Rank = 64 (large):
├─ Params: 14.8M
├─ Memory: 32GB
├─ Accuracy: 92%
└─ Good for: High accuracy needed

Rule of thumb:
└─ Start with rank=16, adjust based on results
```

---

## DOR A (DoRA)

**DoRA** = improved LoRA (recent research)

```
LoRA limitation:
└─ Updates only "direction" of weights (A @ B)
└─ Doesn't update magnitude separately

DoRA improvement:
└─ Separately train magnitude (scale) and direction
└─ Often 1-2% better accuracy than LoRA
└─ Only slightly more complex

Example:
Weight update with LoRA: W + A @ B
Weight update with DoRA: W + (magnitude × direction)
                             where magnitude and direction trained separately
```

**In practice:**
- Most people use LoRA (simpler, good enough)
- DoRA is bleeding-edge (not widely adopted yet)
- Try DoRA if LoRA accuracy not sufficient

---

## Which PEFT Method?

```
Decision tree:

Can you use full fine-tuning? (100GB+ GPU, $1M budget)
└─ YES → Use full (best accuracy: 95%)
└─ NO → Continue

Do you have RTX 4090/A100? (24GB+ VRAM)
├─ YES → Use LoRA (good balance)
├─ NO → Continue

Do you have RTX 3080/3090? (20-24GB VRAM)
├─ YES → Use QLoRA (still fits, cheaper)
└─ NO → Continue

Do you only have consumer GPU? (RTX 4070, 16GB)
└─ YES → Use QLoRA (only option)

Summary:
├─ Best GPU → LoRA (rank=16-32)
├─ Limited GPU → QLoRA (rank=8-16)
├─ Want best accuracy → Full fine-tune (if budget allows)
└─ Need production → LoRA (good accuracy/cost balance)
```

---

## End-to-End Example: Custom Chatbot with QLoRA

```
Goal: Fine-tune Llama-7B on customer support tone

SETUP:
├─ Hardware: RTX 4090 (24GB)
├─ Library: Unsloth (makes QLoRA 2-5x faster)
├─ Dataset: 500 customer service examples
└─ Rank: 16

PROCESS:
1. Load model in Q-LoRA
   └─ Takes 2-3 minutes, uses 16GB RAM

2. Configuration:
   ├─ Rank: 16
   ├─ Learning rate: 2e-4
   ├─ Batch size: 4
   ├─ Epochs: 3
   └─ Gradient accumulation: 2

3. Train for 2 hours
   ├─ Loss drops from 2.5 → 0.8
   ├─ Uses RTX 4090 (monitor: nvidia-smi)
   └─ Save checkpoints every 50 steps

4. Evaluate on held-out test set
   ├─ Zero-shot: 60% accuracy
   ├─ Fine-tuned: 78% accuracy
   └─ Improvement: 18 percentage points!

5. Merge weights
   └─ Write LoRA weights back to base model
   └─ Result: Standalone 7B model (no LoRA overhead)

6. Deploy
   ├─ Load merged model
   ├─ Run on GPU or CPU
   └─ Inference: 5-10 tokens/second

Total cost: Free (your GPU)
Total time: 2-3 hours (plus data prep)
Result: Production-ready custom chatbot
```

---

## Common Pitfalls

❌ **Using too large rank**
- rank=64 might overfit small dataset
- Solution: Start with rank=8-16, increase if needed

❌ **Not using enough data**
- 10 examples won't work (need 50-100 minimum)
- Solution: Collect at least 50+ quality examples

❌ **Training too long**
- Overfitting after epoch 3-5
- Solution: Monitor validation loss, stop early

❌ **Wrong learning rate**
- Too high: training unstable, loss spikes
- Too low: no improvement
- Solution: Try 1e-4 to 5e-4

---

## Key Takeaways

✅ **Full fine-tuning** — All params updated, expensive, best accuracy

✅ **LoRA** — 0.1% params updated, 10x cheaper, 90% accuracy of full

✅ **QLoRA** — LoRA + quantization, fits consumer GPUs, still decent

✅ **Rank parameter** — Controls size/accuracy trade-off (start with 16)

✅ **Practical choice** — LoRA for most use cases

✅ **QLoRA rising** — More accessible due to consumer GPU fit

✅ **Try LoRA first** before expensive full fine-tuning

**Next:** Alignment techniques (how models are trained to be helpful) → RLHF & DPO
