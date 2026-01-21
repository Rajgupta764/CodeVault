"""
Debug Java wrapper
"""
import os
import django
import re

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from problems.services import wrap_java_code

# Test Solution class
solution_code = """
class Solution {
    public int add(int a, int b) {
        return a + b;
    }
}
"""

print("ORIGINAL CODE:")
print(solution_code)
print("\n" + "="*60 + "\n")

wrapped = wrap_java_code(solution_code)
print("WRAPPED CODE:")
print(wrapped)
