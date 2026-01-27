"""
Test actual LeetCode-style problem execution with ListNode
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from problems.services import run_test_cases

print("=" * 70)
print("TESTING LEETCODE-STYLE PROBLEM EXECUTION (mergeTwoLists)")
print("=" * 70)

# This is the actual Solution code user would write
merge_code = """
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

# Test cases in LeetCode format
test_cases = [
    {
        "input": "[1,2,4]\n[1,3,4]",
        "output": "[1,1,2,3,4,4]",
        "explanation": "Merge two sorted linked lists"
    }
]

print("\nRunning test case:")
print(f"Input: [1,2,4] and [1,3,4]")
print(f"Expected Output: [1,1,2,3,4,4]")
print("-" * 70)

results = run_test_cases('JAVA', merge_code, test_cases)

print(f"\nResults:")
print(f"Passed: {results['passed_count']}/{results['total_count']}")
print(f"All Passed: {results['all_passed']}")

for result in results['results']:
    print(f"\nTest Case {result['test_case']}:")
    print(f"  Input: {result['input']}")
    print(f"  Expected: {result['expected']}")
    print(f"  Actual: {result['actual']}")
    print(f"  Status: {'PASSED' if result['passed'] else 'FAILED'}")
    if result['error']:
        print(f"  Error: {result['error']}")

print("\n" + "=" * 70)
if results['all_passed']:
    print("SUCCESS! Test passed!")
else:
    print("Test failed - check output above")
print("=" * 70)
