from selenium import webdriver
import bs4 as bs

url = "http://tennisabstract.com/reports/atp_elo_ratings.html"

options = webdriver.ChromeOptions()
options.add_argument("--no-sandbox")
options.add_argument("--headless")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=options)
driver.get(url)

soup = bs(driver.page_source, "html.parser")
print(soup.prettify())

driver.quit()
