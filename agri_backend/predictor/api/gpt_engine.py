from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os

MODEL_NAME = "deepseek-ai/deepseek-coder-1.3b-base"
OFFLOAD_FOLDER = os.path.join(os.getcwd(), "offload_weights")
os.makedirs(OFFLOAD_FOLDER, exist_ok=True)

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto",
    low_cpu_mem_usage=True,
    offload_folder=OFFLOAD_FOLDER
)
model.eval()

def generate_yield_prediction(prompt: str, max_length: int = 500) -> str:
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True).to(model.device)
    with torch.no_grad():
        outputs = model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_length=max_length,
            do_sample=True,
            temperature=0.7,
            top_k=50,
            top_p=0.9
        )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)
