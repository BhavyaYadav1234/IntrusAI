import subprocess
import time

log_file = "logs/snort_alerts.log"

# Make sure log directory exists
import os
os.makedirs("logs", exist_ok=True)

# Run Snort and redirect output to log
def run_snort():
    print("[+] Starting Snort...")
    cmd = [
        "sudo", "snort",
        "-i", "enp0s1",
        "-A", "fast",
        "-c", "/etc/snort/snort.conf",
        "-l", "logs"
    ]
    return subprocess.Popen(cmd)

# Monitor the log for new alerts
def monitor_log():
    print("[+] Monitoring Snort alerts...")
    with open(log_file, "r") as f:
        f.seek(0, os.SEEK_END)  # Go to end of file
        while True:
            line = f.readline()
            if not line:
                time.sleep(1)
                continue
            print("[ALERT]", line.strip())

if __name__ == "__main__":
    process = run_snort()
    try:
        monitor_log()
    except KeyboardInterrupt:
        print("\n[!] Stopping Snort...")
        process.terminate()
