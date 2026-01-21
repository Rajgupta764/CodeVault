"""
Test script for Piston API integration
"""
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from problems.services import execute_code

# Test Python code execution
print("Testing Piston API with Python...")
python_code = """
print("Hello from Piston API!")
print("2 + 2 =", 2 + 2)
"""

result = execute_code('PYTHON', python_code)
print("\n=== PYTHON TEST ===")
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
print(f"Error: {result['error']}")

# Test with input
print("\n\nTesting with input...")
python_input_code = """
name = input()
print(f"Hello, {name}!")
"""

result = execute_code('PYTHON', python_input_code, "World")
print("\n=== PYTHON WITH INPUT TEST ===")
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
print(f"Error: {result['error']}")

# Test JavaScript
print("\n\nTesting JavaScript...")
js_code = """
console.log("Hello from JavaScript!");
console.log("5 + 3 =", 5 + 3);
"""

result = execute_code('JAVASCRIPT', js_code)
print("\n=== JAVASCRIPT TEST ===")
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
print(f"Error: {result['error']}")

print("\n\n✅ Piston API is working! You can now use code execution without any API key!")
