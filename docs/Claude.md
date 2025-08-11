# Claude.md - Session Startup Guide

## 🚀 Session Startup Checklist

### 1. **Project Status Check**
- [ ] Check current branch and recent commits
- [ ] Review any TODO comments or FIXME notes in codebase
- [ ] Check for any incomplete features from previous session
- [ ] Verify all tests are passing: `npm test`
- [ ] Check for any breaking changes or dependency issues

### 2. **Environment Verification**
- [ ] Confirm Supabase connection is working
- [ ] Test external API connections (YouTube, Instagram, Maps)
- [ ] Verify environment variables are properly set
- [ ] Check local development server starts without errors: `npm run dev`

### 3. **Current Development Context**
- [ ] Check Tasks.md for current sprint status and next priority task
- [ ] Review any blocked tasks or dependencies
- [ ] Update task progress from previous session

**Last worked on:** TASK-007: Basic App Structure (Completed) - UI wireframe implementation
**Current priority:** TASK-008: Storage Buckets Setup (Supabase Storage configuration)  
**Blockers:** None

---

## 🎯 Session Goals Template
```
Today's Objectives:
- [ ] Primary goal:
- [ ] Secondary goal:
- [ ] Stretch goal:

Expected Deliverables:
- [ ] 
- [ ] 
- [ ] 
```

---

## ⚡ Quick Commands Reference
```bash
# Development
npm run dev              # Start dev server (Next.js)
npm test                 # Run tests
npm run build            # Build for production
npm run type-check       # TypeScript check
npm run lint             # ESLint check

# Supabase
npx supabase start       # Start local Supabase
npx supabase status      # Check services status
npx supabase migration new <name>  # Create migration
npx supabase gen types typescript --local > src/types/database.ts  # Generate types

# Vercel
npx vercel dev           # Test with Vercel environment
npx vercel --prod        # Deploy to production

# Git
git status               # Check current status
git log --oneline -10    # Recent commits
```

---

## 🔍 Before Starting Work

### Code Quality Checklist
- [ ] Follow TypeScript strict mode (no `any` types)
- [ ] Use Tailwind CSS classes for styling
- [ ] Implement proper error boundaries and loading states
- [ ] Add proper TypeScript types for new functions/components
- [ ] Follow the Next.js App Router conventions
- [ ] Use Supabase generated types for database operations

### Security Reminders
- [ ] Always use RLS policies for new database tables
- [ ] Validate all user inputs with Zod schemas
- [ ] Never expose sensitive API keys in client code
- [ ] Use proper authentication checks in admin routes
- [ ] Implement CSRF protection for forms

### Performance Considerations
- [ ] Use Next.js Image component for all images
- [ ] Implement proper loading states and error handling
- [ ] Use Server Components where possible for better performance
- [ ] Consider mobile-first responsive design
- [ ] Optimize database queries with proper indexing

---

## 🚨 Common Pitfalls to Avoid

### Next.js App Router Specific
- Don't use pages/ directory structure (use app/ instead)
- Always use Server Components by default, add 'use client' only when needed
- Use proper metadata API for SEO instead of next/head
- Handle async components properly in Server Components
- **Context Pattern**: Use safe fallback patterns for Context hooks when providers may be missing

### Supabase Integration
- Don't forget to enable RLS before adding data
- Always handle network errors gracefully
- Use proper TypeScript types from generated schemas
- Cache frequently accessed data to reduce API calls

### External APIs
- Always implement fallback UI for API failures
- Respect rate limits and implement proper retry logic
- Store API responses locally when possible
- Handle API quota exhaustion gracefully

### Tailwind CSS & PostCSS
- **CRITICAL**: Always ensure postcss.config.js exists for TailwindCSS compilation
- Use consistent spacing scale (4, 8, 12, 16, 24, etc.)
- Follow mobile-first responsive design principles
- Use semantic class names with @apply when needed
- Maintain consistent color palette
- **Fix Pattern**: Missing PostCSS config prevents CSS from loading entirely

---

## 📋 End of Session Checklist
- [ ] Update task progress in Tasks.md (mark completed, in-progress, or blocked)
- [ ] Run type check and fix any TypeScript errors: `npm run type-check`
- [ ] Run linter and fix any issues: `npm run lint`
- [ ] Test build process: `npm run build`
- [ ] Commit current work with descriptive message
- [ ] Update "Last worked on" and "Current priority" above
- [ ] Document any new blockers or issues discovered
- [ ] Push changes to remote repository
- [ ] Update Tasks.md session notes section
- [ ] Set next session priority in Tasks.md

---

## 🔗 Quick Links
- **Tasks Management**: See Tasks.md for current sprint and detailed task breakdown
- **Planning Document**: See Planning.md for architecture and technical decisions
- **PRD Document**: See PRD for feature requirements and specifications
- **Supabase Dashboard**: [Add your project URL]
- **Vercel Dashboard**: [Add your project URL when deployed]
- **Local Development**: http://localhost:3000

## 🧠 Critical Learnings from This Session

### UI Development Issues Resolution
1. **PostCSS Configuration Missing** - Root cause of CSS not loading
   - Solution: Create postcss.config.js with TailwindCSS and Autoprefixer
   - Impact: All TailwindCSS classes now properly compiled and applied

2. **React Context Provider Suspension** - Providers blocking UI rendering
   - Issue: AuthProvider and LanguageProvider causing infinite loading
   - Solution: Removed providers from layout temporarily, implemented safe fallbacks
   - Pattern: Always provide graceful degradation for Context hooks

3. **useLanguage Hook Safety Pattern**
   ```typescript
   // Safe pattern for Context hooks without providers
   export function useLanguage() {
     const context = useContext(LanguageContext);
     if (!context) {
       return { language: 'en', setLanguage: () => {} }; // Safe fallback
     }
     return context;
   }
   ```

4. **Wireframe Implementation Success**
   - Large typography (text-8xl) matching user design
   - Responsive grid layouts with proper aspect ratios
   - PlaceholderImage system for content simulation
   - Modern gallery website aesthetic achieved

### Architecture Decisions Made
- Context providers temporarily disabled to prevent blocking
- Direct translations import in components for stability
- PostCSS as critical dependency for TailwindCSS compilation
- Safe fallback patterns for all Context usage

---

*💡 Remember: Reference Planning.md for architectural decisions and technical specifications. This file is for session management and immediate development context only.*