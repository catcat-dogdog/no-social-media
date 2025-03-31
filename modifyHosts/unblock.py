import os
import platform
import shutil

def get_hosts_path():
    if platform.system() == "Windows":
        return r"C:\Windows\System32\drivers\etc\hosts"
    else:
        return "/etc/hosts"

def restore_hosts_file(backup_path):
    hosts_path = get_hosts_path()
    shutil.copy(backup_path, hosts_path)
    print(f"Hosts file restored from {backup_path}")

def unblock_websites(websites):
    hosts_path = get_hosts_path()

    try:
        with open(hosts_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()

        with open(hosts_path, 'w', encoding='utf-8') as file:
            for line in lines:
                if not any(website in line for website in websites):
                    file.write(line)
                else:
                    print(f"Unblocked {line.strip()}")

    except PermissionError:
        print("Permission denied: Please run this script as an administrator or with sudo privileges.")
    except UnicodeDecodeError:
        print("Error reading the hosts file. Please ensure it is encoded in UTF-8.")

if __name__ == "__main__":
    websites_to_unblock = [
        "www.youtube.com",
        "youtube.com",
        "www.bilibili.com",
        "bilibili.com"
    ]
    unblock_websites(websites_to_unblock)
    # 如果需要恢复整个文件，请取消注释以下行并提供备份路径
    # restore_hosts_file('/path/to/your/backup')