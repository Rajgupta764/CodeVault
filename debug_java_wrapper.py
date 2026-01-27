"""
Debug: See what Java wrapper code is being generated
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from problems.services import wrap_java_code

# Test the wrapper with Solution class
test_code = """
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

wrapped = wrap_java_code(test_code)
print("=" * 70)
print("WRAPPED JAVA CODE:")
print("=" * 70)
print(wrapped)
print("=" * 70)
