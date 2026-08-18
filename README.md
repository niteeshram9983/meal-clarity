# HealthPlate AI

Build a complete, production-quality hackathon web application called HealthPlate AI.

PROJECT OVERVIEW

HealthPlate AI is an explainable, rule-based dietary guidance platform.

The application accepts basic user information, health-condition selection, dietary preferences, allergies, and meal preferences. It then generates an educational SAMPLE meal plan, flags foods that may not fit the selected dietary requirements, explains why they were flagged, and suggests alternatives.

This is a hackathon prototype for demonstrating an explainable rule-based system.

IMPORTANT:

- Do NOT diagnose diseases.

- Do NOT prescribe treatment.

- Do NOT recommend medication.

- Do NOT claim to cure or treat medical conditions.

- Do NOT present the meal plan as a medical prescription.

- Clearly state that the application is educational and does not replace a qualified doctor or dietitian.

---

DESIGN REQUIREMENTS

Create a premium, modern healthcare/wellness UI.

Visual style:

- Clean

- Minimal

- Professional

- Fresh

- Trustworthy

- Modern SaaS dashboard aesthetic

Use:

- White/light backgrounds

- Green as the primary accent

- Soft green backgrounds

- Rounded cards

- Subtle shadows

- Smooth transitions

- Clear typography

- Responsive layouts

Avoid:

- Excessive gradients

- Clutter

- Too many animations

- Cartoonish medical imagery

- Generic AI-looking interfaces

Use a professional font such as Inter.

The application must work beautifully on:

- Desktop

- Tablet

- Mobile

---

TECHNOLOGY

Preferred stack:

Frontend:

- React

- TypeScript

- Tailwind CSS

- shadcn/ui or an equivalent component library

Backend:

- Use the platform's supported backend

- If backend/database is unnecessary for the MVP, implement the rule engine locally

- Structure the code so a database/API can be added later

Do not require paid APIs.

The application must work immediately after generation.

---

PAGE STRUCTURE

Create the following pages:

1. LANDING PAGE

Hero section:

Headline:

"Smarter meal guidance, made understandable."

Subtitle:

"HealthPlate AI creates educational sample meal plans around health conditions, dietary preferences and allergies — with a clear explanation behind every recommendation."

Primary CTA:

"Build My Sample Plan"

Secondary CTA:

"How It Works"

Add three trust indicators:

- Explainable Rules

- Allergy Filtering

- No Paid API Required

Add a visual preview card showing a sample meal plan.

Example:

"Today's Guidance"

"Balanced by Design"

"3 Rule Layers"

"40+ Sample Foods"

"100% Explainable"

---

2. PLANNER PAGE

Create a multi-step or well-organized form.

Collect:

Personal Information

- Age

- Height in cm

- Weight in kg

Health Condition

Dropdown/radio cards:

- Diabetes

- Hypertension

- Diabetes + Hypertension

- No condition selected

Dietary Preference

- Vegetarian

- Non-vegetarian

Allergies

Allow multiple allergies.

Examples:

- Peanuts

- Dairy

- Wheat

- Soy

- Tree nuts

- Other

Meals

Allow:

- 3 meals

- 4 meals

- 5 meals

Food Preferences

Optional text input:

Example:

"I like oats, rice and vegetables."

Add:

"Generate Sample Plan"

button.

Also add a:

"Try Demo Data"

button.

Demo data:

Age: 30

Height: 170 cm

Weight: 65 kg

Condition: Diabetes + Hypertension

Diet: Vegetarian

Allergy: Peanuts

Meals: 5

---

3. RULE ENGINE

Implement a transparent rule-based recommendation engine.

The engine should follow this order:

USER INPUT

↓

CONDITION RULES

↓

DIETARY PREFERENCE FILTER

↓

ALLERGY FILTER

↓

FOOD DATABASE

↓

MEAL TYPE MATCHING

↓

RANKING

↓

SAMPLE MEAL PLAN

↓

WARNINGS + EXPLANATIONS

Do not use a black-box recommendation.

Every recommendation should be explainable.

---

4. CONDITION RULES

Diabetes

Flag foods categorized as high in added sugar or highly refined carbohydrate options.

Prefer:

- Fiber-rich foods

- Vegetables

- Whole-food options

- Balanced meals

- Protein-containing foods

Do not make claims about blood glucose treatment.

Example explanation:

"Flagged because this sample food is categorized as high in added sugar."

---

Hypertension

Flag foods categorized as high in sodium, especially heavily processed or packaged foods.

Prefer:

- Vegetables

- Whole foods

- Lower-sodium options

- Minimally processed foods

Example:

"Flagged because this sample food is categorized as high in sodium."

---

Diabetes + Hypertension

Apply both rule sets.

Example:

A food may be flagged because it has:

- High added sugar

  OR

- High sodium

  OR

- Both

---

5. ALLERGY ENGINE

Allergy filtering must happen BEFORE generating the meal plan.

If the user enters:

"peanuts"

then foods containing peanuts must never appear in the generated meal plan.

The same should work for:

- Dairy

- Wheat

- Soy

- Tree nuts

- Other user-entered allergies

Show:

"Excluded because it matches your listed allergy."

---

6. DIET FILTER

If Vegetarian is selected:

Never recommend:

- Chicken

- Fish

- Meat

- Other meat products

If Non-vegetarian is selected:

Allow suitable protein options.

---

7. FOOD DATABASE

Create a local sample food database containing at least 40 foods.

Each food should contain:

- id

- name

- category

- mealTypes

- vegetarian

- sugarLevel

- sodiumLevel

- fiberLevel

- proteinLevel

- allergens

- explanation

Example structure:

{

name: "Vegetable oats",

category: "Breakfast",

vegetarian: true,

sugarLevel: "low",

sodiumLevel: "low",

fiberLevel: "high",

proteinLevel: "medium",

allergens: [],

explanation: "A fiber-rich, minimally processed option."

}

Include foods from:

Breakfast:

- Vegetable oats

- Moong dal chilla

- Vegetable upma

- Idli

- Unsweetened curd

- Whole-grain options

Lunch:

- Dal

- Whole-grain roti

- Brown rice

- Vegetable curry

- Mixed vegetable salad

- Vegetable khichdi

Snacks:

- Whole fruit

- Roasted chana

- Unsalted nuts where appropriate

- Vegetable snack options

Dinner:

- Vegetable soup

- Dal + roti

- Vegetable khichdi

- Grilled chicken + vegetables

- Fish + vegetables

Also include foods that can be flagged:

- Sugary soft drinks

- Sweets

- Packaged salty snacks

- Instant noodles

- Highly sweetened cereal

Use realistic sample attributes.

---

8. MEAL PLAN GENERATION

Generate a daily SAMPLE plan.

For 3 meals:

Breakfast

Lunch

Dinner

For 4 meals:

Breakfast

Lunch

Snack

Dinner

For 5 meals:

Breakfast

Morning Snack

Lunch

Evening Snack

Dinner

Each meal card must contain:

- Meal name

- Food name

- Short description

- "Why this was selected"

Example:

BREAKFAST

Vegetable Oats

"Fiber-rich sample breakfast option."

WHY?

"Selected because it matches the vegetarian preference and is categorized as a high-fiber, low-sugar option in the sample database."

---

9. FOOD WARNING SYSTEM

Create three visual categories:

GREEN:

"Generally suitable"

YELLOW:

"Limit / consider preparation and portion"

RED:

"Flagged"

On the results page create:

Foods to Limit / Flag

Example:

⚠️ Sugary Soft Drink

Reason:

"Categorized as high in added sugar."

Suggested alternative:

"Unsweetened beverage."

Another:

⚠️ Packaged Salty Snack

Reason:

"Categorized as high in sodium."

Suggested alternative:

"Unsalted roasted chana."

---

10. SMART SUBSTITUTIONS

When a food is flagged, automatically suggest an alternative.

Examples:

Sugary soft drink

→ Unsweetened beverage

Packaged salty snack

→ Unsalted roasted chana

Sweetened cereal

→ Plain oats

High-sodium instant noodles

→ Vegetable khichdi

The alternative must also pass the user's:

- Condition rules

- Allergy rules

- Dietary preference rules

---

11. RESULTS DASHBOARD

After clicking "Generate Sample Plan", display a polished dashboard.

Header:

"Your HealthPlate"

Show:

- Age

- Selected condition

- Dietary preference

- Number of meals

Then display the generated meal cards.

Add sections:

Your Sample Meal Plan

Foods to Limit

Smart Alternatives

Why These Recommendations?

Applied Rules

Example:

✓ Diabetes sugar filter applied

✓ Hypertension sodium filter applied

✓ Vegetarian filter applied

✓ Peanut allergy filter applied

This makes the system highly explainable for the hackathon judges.

---

12. "WHY?" FEATURE

Every recommendation should have a "Why?" button.

When clicked, open a small modal or expandable section.

Example:

WHY WAS THIS RECOMMENDED?

"Vegetable oats was selected because it matches the vegetarian preference and is categorized as a fiber-rich, lower-sugar option in the sample food database."

This feature is important because the project is based on explainable rules.

---

13. HOW IT WORKS PAGE

Create a visual flow diagram:

User Input

↓

Condition Rules

↓

Food Database

↓

Preference Filter

↓

Allergy Filter

↓

Meal Ranking

↓

Sample Meal Plan

↓

Warnings & Alternatives

Explain that the system is:

- Transparent

- Explainable

- Rule-based

- Easy to audit

- Easy to modify

- Designed for educational guidance

---

14. DASHBOARD ANALYTICS

Add a small visual summary after generating a plan.

Example:

Rules Applied:

4

Foods Considered:

40+

Foods Filtered:

8

Meals Generated:

5

Allergy Conflicts:

0

Use attractive cards or simple charts.

Do NOT imply that these numbers represent medical risk scores.

---

15. SAFETY / DISCLAIMER

Display a clear disclaimer on the planner and results page:

"HealthPlate AI provides general educational meal suggestions and is not a substitute for a qualified doctor or dietitian. It does not diagnose, treat or cure medical conditions. People with medical conditions, allergies or special dietary needs should seek individualized professional advice."

Make this visually noticeable but not intrusive.

---

16. NAVIGATION

Navbar:

HealthPlate AI

Links:

- Home

- Planner

- How It Works

- Safety

Button:

"Create Plan"

Footer:

HealthPlate AI

"Explainable dietary guidance — hackathon prototype."

---

17. DEMO MODE

Add a "Try Demo" button.

When clicked, automatically fill:

Age: 30

Height: 170

Weight: 65

Condition: Diabetes + Hypertension

Diet: Vegetarian

Allergy: Peanuts

Meals: 5

Then generate the plan.

This is important because judges should be able to see the project working immediately.

---

18. ERROR HANDLING

Validate:

- Age must be positive

- Height must be realistic

- Weight must be realistic

- At least one condition selection must exist

- Allergy input must be handled safely

Show friendly error messages.

Never allow an allergic food into the generated plan.

---

19. RESPONSIVENESS

Desktop:

Use a two-column planner layout.

Mobile:

Stack everything vertically.

Make buttons large enough for touch.

Ensure:

- No horizontal scrolling

- Cards resize correctly

- Navigation becomes mobile-friendly

---

20. HACKATHON PRESENTATION QUALITY

Make the website look like a real startup MVP rather than a basic college project.

Add:

- Smooth animations

- Hover effects

- Loading state while generating

- Empty states

- Success indicators

- Clean icons

- Consistent spacing

- Professional typography

Do not overuse animation.

---

21. IMPORTANT IMPLEMENTATION REQUIREMENT

Build the actual working application.

Do NOT create only a static landing page.

The following must work:

1. User enters information.

2. User clicks Generate.

3. Rule engine processes the inputs.

4. Foods are filtered.

5. Allergies are checked.

6. Dietary preference is checked.

7. Condition rules are applied.

8. Meals are generated.

9. Warnings are displayed.

10. Alternatives are suggested.

11. Explanations are shown.

The application should be functional immediately after generation.

Use local sample data and deterministic rules so the demo does not depend on an external API.

---

FINAL GOAL

Create a polished, functional hackathon MVP that demonstrates:

"Explainable, condition-aware dietary guidance using a transparent rule engine."

The most important features for judging are:

1. Working rule engine

2. Allergy safety filtering

3. Condition-aware food filtering

4. Personalized sample meal generation

5. Explainable recommendations

6. Smart food substitutions

7. Professional UI

8. Clear medical disclaimer

9. Working demo mode

10. Mobile responsiveness

Do not stop after creating the homepage. Build the complete working application.


<ask_human_response>Data & Integrations — Should this MVP use only local deterministic sample data with no external APIs or login?:

**Add a backend API and database structure too; use all the dynamic data which is avaliable to use according to the given statement from social media and all the sources**

“No condition selected” — Should users be allowed to generate a general educational plan without a health condition?:

**Yes, allow it with no condition rules applied; Require Diabetes, Hypertension, or both**</ask_human_response>


<ask_human_response>No-Condition Plans — Which behavior should I implement?:

**Allow “No condition selected” and apply no condition-specific rules**

External Data — What should “social media and all sources” mean for this hackathon MVP?:

**Use a backend API + MongoDB with the provided 40+ curated foods; no external integrations; Add live web/social-media data ingestion, if you can provide specific public sources or APIs**</ask_human_response>


include type 2 diabetes, heart disease, asthma, arthritis, and Alzheimer's disease in the health condition options



<ask_human_response>Training approach — What should “train the model” mean here?:

**Train an interpretable local ML model (recommended): predict the dataset’s meal-plan category and nutrition targets, then show it as an educational “data-informed pattern” alongside the existing transparent rules; Use the CSV only to expand/calibrate the existing rule engine, without adding ML predictions**

Safety display — Should ML-derived outputs be clearly labeled as educational patterns from the uploaded dataset, never medical advice?:

**Yes, always show that label**</ask_human_response>




TRAIN THE MODEL WITH THE DATASET GIVEN ZIP FILE[[archive.zip]

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/56f81c88-03bc-47cc-87a6-7f6ff18de025).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
