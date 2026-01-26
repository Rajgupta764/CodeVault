"""
SearchBar Component - Visual & Technical Reference Guide

This is a quick visual reference for the SearchBar component.
For detailed documentation, see SEARCHBAR_COMPONENT.md
"""

# ============================================================================
# 1. VISUAL LAYOUT
# ============================================================================

"""
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│                        ✨ SearchBar Component ✨                             │
│                                                                               │
│          Focus Glow Effect (blue/purple gradient)                           │
│                  ↓                                                           │
│    ╔═════════════════════════════════════════════════════════════════╗     │
│    ║  🔍  │ Search problems by name...              │ ← Ctrl+K      ║     │
│    ╚═════════════════════════════════════════════════════════════════╝     │
│         │                    │                              │                │
│     Search Icon         Input Field                    Clear (X)            │
│    (transitions         (placeholder                    Button              │
│     on focus)          animation)                     (when text             │
│                                                       exists)               │
│                                                                               │
│ Recent Searches Dropdown (appears on focus):                                │
│    ┌──────────────────────────────────────────────┐                        │
│    │ 🕐 RECENT SEARCHES                           │                        │
│    ├──────────────────────────────────────────────┤                        │
│    │ 🕐 two sum                              ✕    │  ← click or delete     │
│    │ 🕐 binary tree                          ✕    │                        │
│    │ 🕐 dynamic programming                  ✕    │                        │
│    │ 🕐 graph traversal                      ✕    │                        │
│    │ 🕐 linked list                          ✕    │                        │
│    ├──────────────────────────────────────────────┤                        │
│    │ Clear history                                │  ← clear all           │
│    └──────────────────────────────────────────────┘                        │
│
│ Search Tips (below on focus):
│    Type to search • Press Enter to search
│
└─────────────────────────────────────────────────────────────────────────────┘

STATES:
  Unfocused    → border-white/10, shadow-slate-900/20, text-slate-500
  Focused      → border-blue-500/50, shadow-blue-500/20, text-blue-400
  With text    → X button visible, scale-105
  Hover        → border-white/20
"""

# ============================================================================
# 2. COMPONENT STRUCTURE
# ============================================================================

COMPONENT_TREE = """
SearchBar (wrapper)
├── Glow Effect Layer (backdrop-blur, gradient)
├── Main Input Container
│   ├── Search Icon (left)
│   ├── Input Element
│   ├── Clear Button (right, conditional)
│   └── Keyboard Hint (Ctrl+K, conditional)
├── Recent Searches Dropdown (conditional)
│   ├── Header (with Clock icon)
│   ├── Recent Items (map, clickable)
│   ├── Clear History Button
│   └── Dropdown Arrow
└── Search Tips (below, on focus)
"""

# ============================================================================
# 3. STYLING DETAILS
# ============================================================================

STYLING = {
    "Container": {
        "wrapper": "w-full max-w-2xl mx-auto relative",
        "glow_on_focus": "bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-blue-600/40",
        "glow_base": "blur-xl opacity-0 group-focus-within:opacity-100",
    },
    "Input_Main": {
        "border": "border-2 transition-all duration-300",
        "unfocused": "border-white/10 shadow-lg shadow-slate-900/20 hover:border-white/20",
        "focused": "border-blue-500/50 shadow-2xl shadow-blue-500/20",
        "rounded": "rounded-full",
        "background": "bg-gradient-to-br from-slate-800/50 via-slate-900/50 to-slate-950/50 backdrop-blur-xl",
    },
    "Icons": {
        "search_icon": "w-5 h-5 text-slate-500 group-focus-within:text-blue-400",
        "clear_icon": "w-5 h-5 text-slate-400 hover:text-slate-300",
        "clock_icon": "w-4 h-4 text-slate-500 group-hover:text-slate-400",
    },
    "Input_Field": {
        "padding": "px-4 py-3.5 sm:py-4",
        "text_color": "text-slate-100",
        "placeholder": "placeholder-slate-500",
        "font": "text-base sm:text-lg font-medium",
    },
    "Recent_Dropdown": {
        "background": "from-slate-800/80 via-slate-900/80 to-slate-950/80 backdrop-blur-xl",
        "border": "border border-white/10",
        "rounded": "rounded-2xl",
        "shadow": "shadow-2xl shadow-slate-900/50",
    }
}

# ============================================================================
# 4. INTERACTIVE STATES
# ============================================================================

STATES = {
    "Unfocused_Empty": {
        "border": "white/10",
        "shadow": "slate-900/20",
        "icon_color": "slate-500",
        "shows_hint": True,  # Ctrl+K hint
        "shows_clear": False,
        "scale": 1.0,
    },
    "Focused_Empty": {
        "border": "blue-500/50",
        "shadow": "blue-500/20",
        "icon_color": "blue-400",
        "shows_hint": False,
        "shows_clear": False,
        "shows_recent": True,  # if available
        "scale": 1.05,
    },
    "Focused_WithText": {
        "border": "blue-500/50",
        "shadow": "blue-500/20",
        "icon_color": "blue-400",
        "shows_hint": False,
        "shows_clear": True,
        "shows_recent": False,
        "scale": 1.05,
    },
    "Hover_RecentItem": {
        "background": "white/10",
        "text_color": "slate-100",
        "shows_close": True,
        "transition": "300ms ease",
    }
}

# ============================================================================
# 5. KEYBOARD SHORTCUTS
# ============================================================================

KEYBOARD_SHORTCUTS = {
    "Ctrl+K / Cmd+K": {
        "action": "Focus search input",
        "platform": "All",
        "handler": "handleKeyDown event listener",
    },
    "Enter": {
        "action": "Submit search & add to recent searches",
        "platform": "All",
        "adds_to_history": True,
    },
    "Escape": {
        "action": "Close recent searches dropdown",
        "platform": "All",
        "closes_dropdown": True,
    },
}

# ============================================================================
# 6. DEBOUNCE MECHANISM
# ============================================================================

DEBOUNCE_FLOW = """
User Types
    ↓
Input Change Event
    ↓
Clear Previous Timer (if exists)
    ↓
Start New Timer (300ms default)
    ↓ [Wait 300ms with no new typing]
    ↓
Call onChange() with value
    ↓
Trigger Filter/Search Logic
    ↓
Update UI with Results

If user types before timer ends:
  → Clear timer, restart 300ms counter
  → onChange() NOT called until typing stops
"""

# ============================================================================
# 7. PERFORMANCE TIPS
# ============================================================================

PERFORMANCE_TIPS = {
    "Debounce_Settings": {
        "quick_ui_feedback": "200-300ms",
        "normal_filtering": "300-500ms",
        "api_calls": "800-1500ms",
        "heavy_operations": "1000-2000ms",
    },
    "Best_Practices": [
        "Use useMemo for filtered results",
        "Avoid synchronous filtering on large datasets",
        "Implement virtual scrolling for 1000+ items",
        "Use lazy loading for datasets",
        "Consider pagination for results",
    ]
}

# ============================================================================
# 8. INTEGRATION CHECKLIST
# ============================================================================

INTEGRATION_CHECKLIST = """
☑ 1. Install lucide-react:
      npm install lucide-react

☑ 2. Import SearchBar:
      import SearchBar from '../components/SearchBar'

☑ 3. Set up state:
      const [searchTerm, setSearchTerm] = useState('')

☑ 4. Create useMemo for filtering:
      const filtered = useMemo(() => {
          return items.filter(item =>
              item.name.includes(searchTerm)
          )
      }, [items, searchTerm])

☑ 5. Add SearchBar component:
      <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Custom placeholder..."
      />

☑ 6. Render filtered results:
      {filtered.map(item => <ItemCard item={item} />)}

☑ 7. Test all features:
      - Typing
      - Ctrl+K focus
      - Clear button
      - Recent searches
      - Escape to close
"""

# ============================================================================
# 9. RESPONSIVE BREAKPOINTS
# ============================================================================

RESPONSIVE_DESIGN = {
    "Mobile (< 640px)": {
        "container_width": "w-full",
        "padding": "px-4",
        "input_padding": "py-3.5",
        "text_size": "text-base",
        "icon_size": "w-4 h-4",
        "kbd_hint": "hidden",  # Hidden on mobile
    },
    "Tablet (640px - 1024px)": {
        "container_width": "max-w-xl",
        "padding": "px-6",
        "input_padding": "py-4",
        "text_size": "text-lg",
        "icon_size": "w-5 h-5",
        "kbd_hint": "flex",  # Shows keyboard hint
    },
    "Desktop (> 1024px)": {
        "container_width": "max-w-2xl",
        "padding": "px-8",
        "input_padding": "py-4",
        "text_size": "text-lg",
        "icon_size": "w-5 h-5",
        "kbd_hint": "flex",
    },
}

# ============================================================================
# 10. COLOR SCHEME
# ============================================================================

COLOR_SCHEME = {
    "Primary": {
        "focus_border": "#3B82F6",  # blue-500
        "focus_shadow": "#3B82F6",  # blue-500
        "focus_glow_start": "#1E40AF",  # blue-600
        "focus_glow_mid": "#5B21B6",  # purple-600
        "focus_glow_end": "#0891B2",  # cyan-600
    },
    "Neutral": {
        "icon_inactive": "#64748B",  # slate-500
        "border_base": "#ffffff",  # white
        "border_base_opacity": "10%",
        "text_primary": "#F1F5F9",  # slate-100
        "text_secondary": "#A1A5AB",  # slate-500
        "background": "#1E293B",  # slate-800
    },
    "Accent": {
        "hover": "#ffffff",
        "hover_opacity": "10%",
        "clear_button": "#94A3B8",  # slate-400
    }
}

# ============================================================================
# 11. ACCESSIBILITY FEATURES
# ============================================================================

ACCESSIBILITY = {
    "Semantic_HTML": [
        "<input type='text'> - Native input element",
        "<button> - Clear button (focusable)",
        "Proper form semantics",
    ],
    "Keyboard_Navigation": [
        "Tab to focus input",
        "Tab to focus clear button",
        "Shift+Tab to navigate backwards",
        "Ctrl+K to focus from anywhere",
        "Escape to close dropdown",
    ],
    "ARIA_Attributes": [
        'title="Clear search" on clear button',
        'placeholder text for context',
    ],
    "Focus_Management": [
        "Visible focus indicator (border color change)",
        "Focus shadow effect",
        "Logical tab order",
    ],
    "Color_Contrast": [
        "Dark backgrounds (#1E293B - #0F172A)",
        "Light text (#F1F5F9 - #E2E8F0)",
        "WCAG AA compliant",
    ]
}

# ============================================================================
# 12. TESTING SCENARIOS
# ============================================================================

TEST_SCENARIOS = {
    "Basic_Functionality": [
        "Type in search box → text appears",
        "Debounce activates after 300ms of no typing",
        "onChange callback is called with correct value",
    ],
    "Clear_Button": [
        "Clear button appears when text exists",
        "Clear button disappears when input is empty",
        "Clicking clear removes all text",
        "Focuses back to input after clear",
    ],
    "Recent_Searches": [
        "Dropdown appears on focus with existing searches",
        "Clicking recent search populates input",
        "Clear history removes all searches",
        "Max 5 recent searches stored",
        "Data persists in localStorage",
    ],
    "Keyboard_Shortcuts": [
        "Ctrl+K focuses input from any page",
        "Enter submits and adds to recent",
        "Escape closes dropdown",
    ],
    "Responsive": [
        "Mobile: Full width, touch-friendly",
        "Tablet: Medium width, all features work",
        "Desktop: max-w-2xl, optimized spacing",
    ]
}

# ============================================================================
# 13. COMMON CUSTOMIZATIONS
# ============================================================================

CUSTOMIZATIONS = {
    "Change_Focus_Color": """
        Find: focus ? 'border-blue-500/50 shadow-2xl shadow-blue-500/20'
        Replace with your color: 'border-purple-500/50 shadow-2xl shadow-purple-500/20'
    """,
    "Adjust_Debounce": """
        <SearchBar debounceMs={800} />  // Default is 300
    """,
    "Disable_Recent_Searches": """
        <SearchBar showRecentSearches={false} />
    """,
    "Custom_Placeholder": """
        <SearchBar placeholder="Your custom text..." />
    """,
    "Change_Max_Width": """
        Find: max-w-2xl in SearchBar.jsx
        Replace with: max-w-4xl, max-w-full, etc.
    """,
}

# ============================================================================
# 14. RELATED FILES
# ============================================================================

FILES = {
    "Component": "src/components/SearchBar.jsx (215 lines)",
    "Integration": "src/pages/Dashboard.jsx (updated)",
    "Documentation": "SEARCHBAR_COMPONENT.md (detailed guide)",
    "Examples": "src/components/SearchBarExamples.jsx (7 examples)",
    "Quick_Setup": "SEARCHBAR_SETUP.md (this reference)",
    "Visual_Guide": "This file (you are here)",
}

print(__doc__)
print("\n" + "="*80)
print("Visual & Technical Reference for SearchBar Component")
print("="*80 + "\n")
