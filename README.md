# ✨ Pega Constellation Components – UI Extension Library

A curated collection of **custom React components for Pega Constellation**, built to enhance layouts, improve usability, and deliver UI elements missing from out-of-the-box Constellation.

This library includes action controls, layouts, file utilities, card-based views, paragraph renderers, link widgets, boolean indicators, and advanced RDL variations — all powered through `getPConnect()` for clean integration with case data.

---

## 📚 Component Index

### 🔵 UI Controls & Actions

* **ActionButton**
* **CaseFileDownload**
* **FileDownload**
* **DataObjectAction**
* **OpenInWindow**
* **DeepikaButton (Generic Button)**

---

### 📝 Text / Paragraph Components

* **ParagraphComponent**
* **WidgetParagraph**

---

### 🔗 Navigation & Link Components

* **LinkComponent**
* **URLComponent**

---

### ✅ Boolean Indicator Components

* **BooleanIcon**
* **BooleanLabel**

---

### 📄 Layout Components

* **FormLayout**
* **DetailsRegion**
* **ExtensionLayout (Generic Layout Wrapper)**

---

### 🗂️ Card & List Components

* **CardEx**
* **RDL (Repeat Dynamic Layout)**
* **RDL1 (Alternate RDL Style)**

---

### 🔄 Case Behavior Components

* **CaseTransition**

---

### 📦 Misc Components

* **DataObjectAction**

---

## 💠 Component Descriptions

---

## 🔵 UI CONTROLS & ACTIONS

### **ActionButton**

A flexible button component designed for Constellation actions like submitting forms, triggering data transforms, refreshing data, or custom events.

**Highlights**

* Works beautifully in toolbars or inside sections
* Supports icons, primary/secondary modes, and disabled states
* Can call client or server actions through `getPConnect()`

---

### **CaseFileDownload**

A simplified file download trigger that fetches case attachments or generated documents.

**Highlights**

* Supports single or multi-file download
* Ideal for confirmation screens or document sections
* Automatically handles missing files gracefully

---

### **FileDownload**

A more general-purpose file download widget used when the file is NOT directly tied to a case attachment list.

**Highlights**

* Supports file labels, icons, and inline placement
* Clean drop-in component for any page needing downloads

---

### **OpenInWindow**

Opens a given URL or Pega view in a new browser tab or window.

**Highlights**

* Great for dashboards
* Works well for opening reports, portals, or external resources

---

### **DeepikaButton (Generic Button)**

A reusable, foundational button component.

**Highlights**

* Custom label, icon, action, and styles
* Common behavior shared across multiple components

---

## 📝 TEXT / PARAGRAPH COMPONENTS

### **ParagraphComponent**

Renders Pega Paragraph rule content inside Constellation layouts.

**Highlights**

* Ideal for instructions, descriptive blocks, or disclaimers
* Avoids hardcoded text in React
* Dynamic support for HTML content

---

### **WidgetParagraph**

A paragraph displayed in a themed widget-like container.

**Highlights**

* Perfect for dashboards or highlighting information
* Provides padding, borders, and clean formatting

---

## 🔗 NAVIGATION / LINK COMPONENTS

### **LinkComponent**

A stylized link that can trigger:

* Navigation to another case
* Opening external URLs
* Launching actions

**Highlights**

* Inline, button-style, or icon-based links
* Fully configurable

---

### **URLComponent**

Displays a URL field from case data as a clickable link.

**Highlights**

* Supports open-in-new-tab
* Auto-truncation or full-link rendering
* Clean and readable presentation

---

## ✅ BOOLEAN COMPONENTS

### **BooleanIcon**

Shows a boolean value using icons such as ✔ / ✘.

**Highlights**

* Excellent for list views
* Quick visual read of status fields

---

### **BooleanLabel**

Displays a boolean value as a formatted textual label.

**Examples**

* Active / Inactive
* Yes / No
* Enabled / Disabled

---

## 📄 LAYOUT COMPONENTS

### **FormLayout**

A form arrangement component for grouping fields.

**Highlights**

* Supports multiple layout modes
* Consistent spacing and alignment across forms

---

### **DetailsRegion**

A polished detail panel for displaying grouped, labeled fields.

**Highlights**

* Mimics “view details” cards from modern SaaS UI
* Supports read-only and editable configurations
* Great for summaries and review screens

---

### **ExtensionLayout (Generic Layout Wrapper)**

A universal wrapper for embedding custom components inside Constellation views.

**Highlights**

* Central place to manage `getPConnect()`
* Lets you drop custom React logic into Pega seamlessly

---

## 🗂️ CARD & LIST COMPONENTS

### **CardEx**

A powerful card layout component for showing:

* Case summaries
* Customer information
* Sub-case details

**Highlights**

* Header + body + footer structure
* Can host actions, icons, or badges

---

### **RDL (Repeat Dynamic Layout)**

A custom RDL engine for rendering lists of items with full React control.

**Highlights**

* Flexible row templates
* Inline fields, badges, or actions
* Looks cleaner than standard Constellation repeating blocks

---

### **RDL1 (Alternate RDL)**

A second variation of RDL with a different visual layout.

**Highlights**

* Compact design
* Useful for dashboards or embedded summaries

---

## 🔄 CASE BEHAVIOR COMPONENTS

### **CaseTransition**

A clean component that moves a case to the next stage or process step.

**Highlights**

* Reads available transitions through Constellation
* Presents a primary “Next” action or multiple step options
* Perfect for custom case headers or landing screens

---

## 🧩 MISC

### **DataObjectAction**

Triggers actions related to data objects — not just work objects.

**Highlights**

* Useful for customer, order, or profile objects
* Supports data refresh, update, or integration pulls

---
