"""
Code execution service supporting multiple APIs (Piston, Judge0).
"""
import base64
import time
import requests
from django.conf import settings


# API Selection - Choose 'piston' or 'judge0'
CODE_EXECUTION_API = getattr(settings, 'CODE_EXECUTION_API', 'piston')

# Piston API Configuration (FREE - No API key needed!)
PISTON_API_URL = getattr(settings, 'PISTON_API_URL', 'https://emkc.org/api/v2/piston')

# Judge0 API Configuration (Requires RapidAPI subscription)
JUDGE0_API_URL = getattr(settings, 'JUDGE0_API_URL', 'https://judge0-ce.p.rapidapi.com')
JUDGE0_API_KEY = getattr(settings, 'JUDGE0_API_KEY', '')
JUDGE0_API_HOST = getattr(settings, 'JUDGE0_API_HOST', 'judge0-ce.p.rapidapi.com')

# Language mapping for Piston
PISTON_LANGUAGE_MAP = {
    'JAVA': 'java',
    'PYTHON': 'python',
    'CPP': 'cpp',
    'JAVASCRIPT': 'javascript',
    'C': 'c'
}

# Language ID mapping for Judge0
JUDGE0_LANGUAGE_IDS = {
    'JAVA': 62,      # Java (OpenJDK 13.0.1)
    'PYTHON': 71,    # Python 3.8.1
    'CPP': 54,       # C++ (GCC 9.2.0)
    'JAVASCRIPT': 63 # JavaScript (Node.js 12.14.0)
}

# Maximum number of polling attempts
MAX_POLL_ATTEMPTS = 10
POLL_INTERVAL = 1  # seconds


# ==================== HELPER FUNCTIONS ====================

def wrap_java_code(code):
    """
    Wrap Java code with imports and main method (LeetCode-style).
    Automatically adds common Java imports so users don't need to.
    
    Args:
        code (str): Java source code
        
    Returns:
        str: Wrapped Java code ready to execute with imports
    """
    code = code.strip()
    
    # Common Java imports (LeetCode-style)
    common_imports = """
import java.util.*;
import java.io.*;
import java.lang.*;
import java.math.*;
"""
    
    # Check if code already has imports
    has_imports = code.startswith('import ')
    
    # Check if code already has a main method
    if 'static void main' in code:
        # If it has main but no imports, add them
        if not has_imports:
            return common_imports + "\n" + code
        return code
    
    # Remove 'public' from any class declaration
    # Java requires public class name to match filename
    import re
    code = re.sub(r'\bpublic\s+class\s+', 'class ', code)
    
    # Pattern 1: User has a class (LeetCode style - just Solution class)
    # Add imports + Main class FIRST so Piston runs it
    if 'class ' in code:
        return f"""{common_imports}

public class Main {{
    public static void main(String[] args) {{
        System.out.println("Code compiled successfully!");
        // You can add test cases here
    }}
}}

{code}
"""
    
    # Pattern 2: User wrote just code statements (no class)
    # Wrap in Main class with imports
    return f"""{common_imports}

public class Main {{
    public static void main(String[] args) {{
{code}
    }}
}}
"""


# ==================== PISTON API FUNCTIONS ====================

def execute_code_piston(language, code, input_data=""):
    """
    Execute code using Piston API (FREE - No API key required!)
    
    Args:
        language (str): Programming language (JAVA, PYTHON, CPP, JAVASCRIPT)
        code (str): Source code to execute
        input_data (str): Input data for stdin
        
    Returns:
        dict: Execution result compatible with Judge0 format
    """
    try:
        # Get Piston language identifier
        language_upper = language.upper()
        if language_upper not in PISTON_LANGUAGE_MAP:
            raise ValueError(f"Unsupported language: {language}. Supported: {', '.join(PISTON_LANGUAGE_MAP.keys())}")
        
        piston_language = PISTON_LANGUAGE_MAP[language_upper]
        
        # Wrap Java code with main method if needed
        if language_upper == 'JAVA':
            code = wrap_java_code(code)
        
        # Prepare execution request
        # For Java, specify filename as Main.java
        file_payload = {
            "content": code
        }
        if language_upper == 'JAVA':
            file_payload["name"] = "Main.java"
        
        payload = {
            "language": piston_language,
            "version": "*",  # Use latest version
            "files": [file_payload],
            "stdin": input_data
        }
        
        # Execute code
        url = f"{PISTON_API_URL}/execute"
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        
        result = response.json()
        
        # Extract results
        run_result = result.get('run', {})
        compile_result = result.get('compile', {})
        
        # Determine status
        # Check compile errors first
        if compile_result and compile_result.get('code') != 0:
            status = 'Compilation Error'
            status_id = 6
        # Check for successful execution (exit code 0)
        elif run_result.get('code') == 0:
            status = 'Accepted'
            status_id = 3
        # Check for signals (crashes)
        elif run_result.get('signal'):
            status = 'Runtime Error (Signal)'
            status_id = 11
        # Non-zero exit code
        elif run_result.get('code'):
            # If there's stdout output, consider it accepted despite error in stderr
            if run_result.get('stdout', '').strip():
                status = 'Accepted'
                status_id = 3
            else:
                status = 'Runtime Error (Non-zero exit)'
                status_id = 11
        else:
            status = 'Unknown'
            status_id = 0
        
        # Return in Judge0-compatible format
        return {
            'output': run_result.get('stdout', ''),
            'error': run_result.get('stderr', ''),
            'status': status,
            'status_id': status_id,
            'time': '0',  # Piston doesn't provide execution time
            'memory': 0,  # Piston doesn't provide memory usage
            'compile_output': compile_result.get('output', '') if compile_result else ''
        }
        
    except ValueError as e:
        return {
            'output': '',
            'error': str(e),
            'status': 'Error',
            'status_id': 0,
            'time': '0',
            'memory': 0,
            'compile_output': ''
        }
    except requests.RequestException as e:
        return {
            'output': '',
            'error': f'Piston API Error: {str(e)}',
            'status': 'Error',
            'status_id': 0,
            'time': '0',
            'memory': 0,
            'compile_output': ''
        }
    except Exception as e:
        return {
            'output': '',
            'error': f'Unexpected error: {str(e)}',
            'status': 'Error',
            'status_id': 0,
            'time': '0',
            'memory': 0,
            'compile_output': ''
        }


# ==================== JUDGE0 API FUNCTIONS ====================


def get_language_id(language):
    """
    Convert language string to Judge0 language ID.
    
    Args:
        language (str): Language name (JAVA, PYTHON, CPP, JAVASCRIPT)
        
    Returns:
        int: Judge0 language ID
        
    Raises:
        ValueError: If language is not supported
    """
    language_upper = language.upper()
    if language_upper not in JUDGE0_LANGUAGE_IDS:
        raise ValueError(f"Unsupported language: {language}. Supported: {', '.join(JUDGE0_LANGUAGE_IDS.keys())}")
    return JUDGE0_LANGUAGE_IDS[language_upper]


def encode_base64(text):
    """
    Encode text to base64 string.
    
    Args:
        text (str): Text to encode
        
    Returns:
        str: Base64 encoded string
    """
    if not text:
        return ""
    return base64.b64encode(text.encode('utf-8')).decode('utf-8')


def decode_base64(encoded_text):
    """
    Decode base64 string to text.
    
    Args:
        encoded_text (str): Base64 encoded string
        
    Returns:
        str: Decoded text
    """
    if not encoded_text:
        return ""
    try:
        return base64.b64decode(encoded_text.encode('utf-8')).decode('utf-8')
    except Exception:
        return encoded_text


def create_submission(language, source_code, stdin=""):
    """
    Create a code submission on Judge0.
    
    Args:
        language (str): Programming language
        source_code (str): Source code to execute
        stdin (str): Standard input for the program
        
    Returns:
        str: Submission token
        
    Raises:
        requests.RequestException: If API request fails
        ValueError: If response is invalid
    """
    language_id = get_language_id(language)
    
    # Prepare submission data
    submission_data = {
        "language_id": language_id,
        "source_code": encode_base64(source_code),
        "stdin": encode_base64(stdin),
        "wait": False
    }
    
    # API headers
    headers = {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": JUDGE0_API_KEY,
        "X-RapidAPI-Host": JUDGE0_API_HOST
    }
    
    # Create submission
    url = f"{JUDGE0_API_URL}/submissions?base64_encoded=true&fields=*"
    response = requests.post(url, json=submission_data, headers=headers, timeout=10)
    response.raise_for_status()
    
    result = response.json()
    token = result.get('token')
    
    if not token:
        raise ValueError("No token returned from Judge0 API")
    
    return token


def get_submission_result(token):
    """
    Retrieve submission result from Judge0.
    
    Args:
        token (str): Submission token
        
    Returns:
        dict: Submission result
        
    Raises:
        requests.RequestException: If API request fails
    """
    headers = {
        "X-RapidAPI-Key": JUDGE0_API_KEY,
        "X-RapidAPI-Host": JUDGE0_API_HOST
    }
    
    url = f"{JUDGE0_API_URL}/submissions/{token}?base64_encoded=true&fields=*"
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    
    return response.json()


def poll_submission_result(token, max_attempts=MAX_POLL_ATTEMPTS, interval=POLL_INTERVAL):
    """
    Poll for submission result until completion.
    
    Args:
        token (str): Submission token
        max_attempts (int): Maximum number of polling attempts
        interval (float): Seconds to wait between attempts
        
    Returns:
        dict: Final submission result
        
    Raises:
        TimeoutError: If result not ready after max attempts
        requests.RequestException: If API request fails
    """
    for attempt in range(max_attempts):
        result = get_submission_result(token)
        status_id = result.get('status', {}).get('id')
        
        # Status IDs: 1=In Queue, 2=Processing, 3=Accepted, 4+=Error/Failed
        # Wait if still processing (status 1 or 2)
        if status_id in [1, 2]:
            time.sleep(interval)
            continue
        
        # Result ready
        return result
    
    raise TimeoutError("Code execution timed out. Please try again.")


def execute_code(language, code, input_data=""):
    """
    Execute code using configured API (Piston or Judge0).
    
    Args:
        language (str): Programming language (JAVA, PYTHON, CPP, JAVASCRIPT)
        code (str): Source code to execute
        input_data (str): Input data for stdin
        
    Returns:
        dict: Execution result with keys:
            - output (str): Standard output
            - error (str): Error message if any
            - status (str): Execution status description
            - status_id (int): Status ID
            - time (str): Execution time
            - memory (int): Memory used in KB
            - compile_output (str): Compilation output/errors
    """
    # Validate inputs
    if not code or not code.strip():
        return {
            'output': '',
            'error': 'No code provided',
            'status': 'Error',
            'status_id': 0,
            'time': '0',
            'memory': 0,
            'compile_output': ''
        }
    
    # Route to appropriate API
    if CODE_EXECUTION_API.lower() == 'piston':
        return execute_code_piston(language, code, input_data)
    else:
        return execute_code_judge0(language, code, input_data)


def execute_code_judge0(language, code, input_data=""):
    """
    Execute code using Judge0 API.
    
    Args:
        language (str): Programming language (JAVA, PYTHON, CPP, JAVASCRIPT)
        code (str): Source code to execute
        input_data (str): Input data for stdin
        
    Returns:
        dict: Execution result with keys:
            - output (str): Standard output
            - error (str): Error message if any
            - status (str): Execution status description
            - status_id (int): Status ID
            - time (str): Execution time
            - memory (int): Memory used in KB
            - compile_output (str): Compilation output/errors
            
    Raises:
        ValueError: If language is not supported
        Exception: For other errors during execution
    """
    try:
        # Create submission
        token = create_submission(language, code, input_data)
        
        # Poll for result
        result = poll_submission_result(token)
        
        # Extract and decode result fields
        return {
            'output': decode_base64(result.get('stdout', '')),
            'error': decode_base64(result.get('stderr', '')),
            'status': result.get('status', {}).get('description', 'Unknown'),
            'status_id': result.get('status', {}).get('id', 0),
            'time': result.get('time', '0'),
            'memory': result.get('memory', 0),
            'compile_output': decode_base64(result.get('compile_output', ''))
        }
        
    except ValueError as e:
        # Language validation error
        return {
            'output': '',
            'error': str(e),
            'status': 'Error',
            'status_id': 0,
            'time': '0',
            'memory': 0,
            'compile_output': ''
        }
        
    except TimeoutError as e:
        # Execution timeout
        return {
            'output': '',
            'error': str(e),
            'status': 'Time Limit Exceeded',
            'status_id': 5,
            'time': '0',
            'memory': 0,
            'compile_output': ''
        }
        
    except requests.RequestException as e:
        # API request error
        return {
            'output': '',
            'error': f'API Error: {str(e)}',
            'status': 'Error',
            'status_id': 0,
            'time': '0',
            'memory': 0,
            'compile_output': ''
        }
        
    except Exception as e:
        # Unexpected error
        return {
            'output': '',
            'error': f'Unexpected error: {str(e)}',
            'status': 'Error',
            'status_id': 0,
            'time': '0',
            'memory': 0,
            'compile_output': ''
        }
