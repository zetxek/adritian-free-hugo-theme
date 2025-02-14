# To install dependencies:
# pip install weasyprint
#
# On Ubuntu/Debian you may also need:
# apt-get install python3-cffi python3-brotli libpango-1.0-0 libharfbuzz0b libpangoft2-1.0-0
#
# See https://doc.courtbouillon.org/weasyprint/stable/first_steps.html for full installation instructions
import sys


try:
    sys.setrecursionlimit(100000)
    from weasyprint import HTML
    output_path = '/tmp/cv.pdf'
    HTML('http://localhost:1313/cv/').write_pdf(output_path)
    print(f"PDF has been successfully created at: {output_path}")
except ImportError:
    print("Error: weasyprint module not found. Please install it using: pip install weasyprint")
except Exception as e:
    print(f"An error occurred: {str(e)}")

