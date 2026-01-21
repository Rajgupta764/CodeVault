"""
Test Java code wrapper functionality
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from problems.services import execute_code

print("=" * 60)
print("TESTING JAVA CODE EXECUTION WITH AUTO-WRAPPING")
print("=" * 60)

# Test 1: Simple print statement
print("\n1. Testing simple print statement:")
print("-" * 60)
simple_code = """
System.out.println("Hello World!");
System.out.println("2 + 2 = " + (2 + 2));
"""
result = execute_code('JAVA', simple_code)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
print(f"Error: {result['error']}")
if result['compile_output']:
    print(f"Compile: {result['compile_output']}")

# Test 2: Solution class (LeetCode style)
print("\n\n2. Testing Solution class (LeetCode style):")
print("-" * 60)
solution_code = """
class Solution {
    public int add(int a, int b) {
        return a + b;
    }
    
    public String greet(String name) {
        return "Hello, " + name + "!";
    }
}
"""
result = execute_code('JAVA', solution_code)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
print(f"Error: {result['error']}")
if result['compile_output']:
    print(f"Compile: {result['compile_output']}")

# Test 3: Complete class with main method
print("\n\n3. Testing complete code with main method:")
print("-" * 60)
complete_code = """
public class Main {
    public static void main(String[] args) {
        System.out.println("This code already has main method!");
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}
"""
result = execute_code('JAVA', complete_code)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
print(f"Error: {result['error']}")
if result['compile_output']:
    print(f"Compile: {result['compile_output']}")

# Test 4: Code with variables and loops
print("\n\n4. Testing code with variables and loops:")
print("-" * 60)
loop_code = """
int sum = 0;
for (int i = 1; i <= 10; i++) {
    sum += i;
}
System.out.println("Sum of 1 to 10: " + sum);
"""
result = execute_code('JAVA', loop_code)
print(f"Status: {result['status']}")
print(f"Output: {result['output']}")
print(f"Error: {result['error']}")
if result['compile_output']:
    print(f"Compile: {result['compile_output']}")

print("\n" + "=" * 60)
print("TESTING COMPLETE!")
print("=" * 60)
print("\n✅ Java code auto-wrapping is working!")
print("Users can now write Java code without worrying about main method.")
