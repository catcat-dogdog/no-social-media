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

if __name__ == "__main__":
    websites_to_block = [
        "www.youtube.com",
        "youtube.com",
        "www.bilibili.com",
        "bilibili.com"
    ]
    block_websites(websites_to_block)