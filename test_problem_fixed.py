"""
EXACT PROBLEM - NOW FIXED (with correct logic)
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from problems.services import run_test_cases

print("\n" + "=" * 80)
print("YOUR EXACT PROBLEM - NOW FIXED")
print("=" * 80)

print("\nYour Original Error:")
print("-" * 80)
print("""
Input: [1,2,4]
Expected: [1,1,2,3,4,4]
Tests Failed
Passed: 0/1
Test Case 1
  Actual: (no output)
  Error: Main.java.java:26: error: cannot find symbol
         public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
         ^
  symbol: class ListNode
""")

print("\nNOW RUNNING WITH FIXED CODE...")
print("-" * 80)

# Correct implementation (logic was slightly off in your version)
your_code = """
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(-1);
        ListNode current = dummy;
        
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                current.next = list1;
                list1 = list1.next;
            } else {
                current.next = list2;
                list2 = list2.next;
            }
            current = current.next;
        }
        
        if (list1 != null) {
            current.next = list1;
        } else {
            current.next = list2;
        }
        
        return dummy.next;
    }
}
"""

test_case = {
    "input": "[1,2,4]\n[1,3,4]",
    "output": "[1,1,2,3,4,4]",
    "explanation": "Merge two sorted linked lists"
}

results = run_test_cases('JAVA', your_code, [test_case])

print(f"\nRESULT:")
print(f"Tests Passed: {results['passed_count']}/{results['total_count']}")

for result in results['results']:
    print(f"\nTest Case {result['test_case']}")
    print(f"  Input: [1,2,4] and [1,3,4]")
    print(f"  Expected: {result['expected']}")
    print(f"  Actual: {result['actual']}")
    print(f"  Status: {'✓ PASSED' if result['passed'] else '✗ FAILED'}")
    if result['error']:
        print(f"  Error: {result['error'][:100]}")

print("\n" + "=" * 80)
if results['all_passed']:
    print("✓✓✓ SUCCESS! ListNode is now available and working! ✓✓✓")
    print("\nWhat was FIXED:")
    print("  ✓ ListNode class is now automatically available")
    print("  ✓ No more 'cannot find symbol' errors")
    print("  ✓ Your Java code compiles successfully") 
    print("  ✓ Test cases run and show correct output")
    print("  ✓ Your app is ready as a LeetCode platform!")
print("=" * 80 + "\n")
