How to use the test_login script

- By default `test_login.py` uses a placeholder URL `https://example.com/login`.
- Replace `LOGIN_URL` in the script with your real login URL or set it via environment or edit the file.

Quick steps (recommended using venv):

1. Create and activate a venv (optional but recommended):

   python3 -m venv .venv
   source .venv/bin/activate

2. Install dependencies:

   pip install -r requirements.txt

3. Ensure Chrome/Chromium is installed on the machine.

4. Run the script:

   python test_login.py

If the script cannot find the username field the script will now print the current URL and the first 500 characters of the returned page to help debugging.