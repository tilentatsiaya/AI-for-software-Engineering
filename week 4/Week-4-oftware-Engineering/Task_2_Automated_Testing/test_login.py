from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import os

try:
    from webdriver_manager.chrome import ChromeDriverManager
    _WM_AVAILABLE = True
except Exception:
    _WM_AVAILABLE = False

LOGIN_URL = 'https://example.com/login'

opts = Options()
# Use new headless mode when available; add common safe flags for CI
opts.add_argument('--headless=new')
opts.add_argument('--no-sandbox')
opts.add_argument('--disable-dev-shm-usage')

if _WM_AVAILABLE:
    # Use webdriver-manager to automatically download matching chromedriver
    service = Service(ChromeDriverManager().install())
else:
    # Fallback: allow the user to provide a CHROME_DRIVER_PATH env var
    CHROME_DRIVER_PATH = os.environ.get('CHROME_DRIVER_PATH')
    if not CHROME_DRIVER_PATH:
        raise RuntimeError(
            "webdriver-manager is not installed and CHROME_DRIVER_PATH is not set. "
            "Install webdriver-manager or set the CHROME_DRIVER_PATH environment "
            "variable."
        )
    service = Service(CHROME_DRIVER_PATH)


def run_login_test(username, password, timeout=10):
    """Run a login attempt and return True if redirected to a URL
    containing 'dashboard'.

    Uses explicit waits instead of sleep for reliability.
    """
    driver = webdriver.Chrome(service=service, options=opts)
    try:
        driver.get(LOGIN_URL)

        try:
            WebDriverWait(
                driver, timeout
            ).until(
                EC.presence_of_element_located((By.NAME, 'username'))
            )
        except TimeoutException:
            # Helpful debug output when the expected field isn't present
            print('Timeout waiting for username field.')
            print('Current URL:', driver.current_url)
            ps = driver.page_source or ''
            print('Page source snippet:', ps[:500])
            return False

        driver.find_element(By.NAME, 'username').send_keys(username)
        driver.find_element(By.NAME, 'password').send_keys(password)
        driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

        try:
            WebDriverWait(driver, timeout).until(
                EC.url_contains('dashboard')
            )
            return True
        except TimeoutException:
            return False
    finally:
        driver.quit()


if __name__ == '__main__':
    print('Valid login:', run_login_test('valid_user', 'valid_pass'))
    print('Invalid login:', run_login_test('invalid_user', 'wrong_pass'))
