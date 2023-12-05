import threading, socket, time, os
from colorama import init, Fore
from art import text2art

def scan_port(target_ip, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        sock.connect((target_ip, port))
        print(f"[+] Porta {port} aberta em {target_ip}")
        sock.close()
    except socket.error:
        pass

def titulo():
    titulo = text2art("SecQ", font='starwars', chr_ignore=True)
    print(Fore.RED + titulo + Fore.RESET + "=============== POWERED BY RAI ===============\n")

def port_scanner(target_ip, ports):
    start_time = time.time()
    threads = []

    print(f"\n[!] Scanning {target_ip}...")

    for port in ports:
        thread = threading.Thread(target=scan_port, args=(target_ip, port))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    elapsed_time = time.time() - start_time
    print(f"\n[!] Scanning concluída | {elapsed_time:.2f} Segundos")

def main():
    hostname = input("[?] Digite o hostname: ")
    
    try:
        target_ip = socket.gethostbyname(hostname)
    except socket.gaierror:
        print("[-] Hostname inválido ou não foi possível resolver o IP.")
        return

    ports_to_scan = range(0, 5000)

    port_scanner(target_ip, ports_to_scan)

if __name__ == "__main__":
    os.system("clear")
    titulo()
    time.sleep(0.1)
    main()