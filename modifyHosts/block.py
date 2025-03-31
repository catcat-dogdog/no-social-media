import os
import platform
import shutil
from datetime import datetime

def get_hosts_path():
    if platform.system() == "Windows":
        return r"C:\Windows\System32\drivers\etc\hosts"
    else:
        return "/etc/hosts"

def backup_hosts_file():
    hosts_path = get_hosts_path()
    backup_path = f"{hosts_path}.backup_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    shutil.copy(hosts_path, backup_path)
    print(f"Backup created at {backup_path}")

def block_websites(websites):
    hosts_path = get_hosts_path()
    redirect_ip = "127.0.0.1"

    try:
        backup_hosts_file()
        with open(hosts_path, 'r+', encoding='utf-8') as file:
            content = file.read()
            for website in websites:
                if website not in content:
                    file.write(f"{redirect_ip} {website}\n")
                    print(f"Blocked {website}")
                else:
                    print(f"{website} is already blocked")
    except PermissionError:
        print("Permission denied: Please run this script as an administrator or with sudo privileges.")

def read_websites_from_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            websites = [line.strip() for line in file if line.strip()]
        return websites
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return []
    except Exception as e:
        print(f"Error reading file: {str(e)}")
        return []

if __name__ == "__main__":
    websites_file = "websites_to_block.txt"
    websites_to_block = read_websites_from_file(websites_file)
    if websites_to_block:
        block_websites(websites_to_block)