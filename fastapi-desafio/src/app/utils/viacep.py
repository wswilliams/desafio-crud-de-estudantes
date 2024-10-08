import requests

def validate_address(address):
    # Remove espaços em branco no início e no fim do endereço
    address = address.strip()

    # Consulta o serviço Viaidade para validar o endereço
    response = requests.get(f"https://viaidade.com.br/ws/{address}/json/")

    if response.status_code == 200:
        data = response.json()
        if "erro" not in data:
            return True

    return False