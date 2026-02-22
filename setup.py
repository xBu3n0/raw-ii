import shutil
import subprocess
from pathlib import Path

FOLDERS = [Path("nestjs"), Path("frontend")]

def setup_env_files(folder: Path):
    example_file = folder / ".env.example"
    
    if not example_file.exists():
        print(f"Erro: {example_file} não existe.")
        return
    
    files_to_create = [".env", ".env.dev", ".env.prod"]
    
    for filename in files_to_create:
        target_file = folder / filename
        if not target_file.exists():
            shutil.copy(example_file, target_file)
            print(f"\t{target_file} criado")


def generate_ssl_certificate():
    ssl_dir = Path("./nginx/ssl")
    ssl_dir.mkdir(parents=True, exist_ok=True)
    
    cert_key = ssl_dir / "cert.key"
    cert_crt = ssl_dir / "cert.crt"
    
    if cert_key.exists() and cert_crt.exists():
        return
    
    command = [
        "openssl", "req", "-x509", "-nodes", "-days", "365",
        "-newkey", "rsa:2048", "-keyout", str(cert_key),
        "-out", str(cert_crt), "-subj", "/C=US/ST=State/L=City/O=Org/CN=localhost"
    ]
    
    subprocess.run(command, check=True)
    print("SSL certificates generated successfully")


if __name__ == "__main__":
    for folder in FOLDERS:
        setup_env_files(folder)
    
    generate_ssl_certificate()

    print("Setup completo. Você pode iniciar os containers usando: 'docker compose [-f compose.dev.yml] up -d'")
