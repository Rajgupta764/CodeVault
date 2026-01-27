"""
Test simple Java execution first
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from problems.services import execute_code

print("Testing SIMPLE Java code that should definitely work:")
print("=" * 60)

simple = """
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
"""

result = execute_code('JAVA', simple)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
print(f"Error: {result['error']}")
if result['compile_output']:
    print(f"Compile: {result['compile_output']}")
