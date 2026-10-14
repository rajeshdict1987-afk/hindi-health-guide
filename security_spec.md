# Security Specification for Hindi Health Guide (Firestore ABAC)

## 1. Data Invariants
- **Public Read Guarantee**: Public unauthenticated users can ONLY read articles where `resource.data.status == 'published'`.
- **Draft Privacy**: Draft and archived articles (`status in ['draft', 'archived']`) can NEVER be queried or read by unauthenticated users or standard readers. Only authenticated editors and admins may read or edit them.
- **Doctor Verification Integrity**: Medical reviews (`editorialReviews`) can only be authored or modified by authorized medical reviewers/admins. Standard users cannot fabricate medical review credentials.
- **Fixed Categories Protection**: The 7 approved categories are read-only for public users. Creation, modification, or deletion of categories is strictly forbidden except by super admins to prevent category tampering.
- **Role Elevation Guard**: Users cannot elevate their own role (`role: 'admin'`) during document creation or profile updates.
- **Immortal Fields**: Fields like `createdAt`, `authorId`, and `id` are immutable once created.
- **Temporal Integrity**: All timestamp fields (`createdAt`, `updatedAt`) must strictly match `request.time`.

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Unpublished Draft Scraping**: Unauthenticated client querying `/articles` without `status == 'published'` filter. (Expected: PERMISSION_DENIED)
2. **Ghost Field Injection (Shadow Update)**: Authenticated editor attempting to update an article with extra arbitrary property `isFeaturedOverride: true`. (Expected: PERMISSION_DENIED)
3. **Identity Spoofing**: User A creating an article with `authorId: 'user-b-id'`. (Expected: PERMISSION_DENIED)
4. **Self-Promotion to Admin**: User setting `role: 'admin'` on their `/users/{uid}` document. (Expected: PERMISSION_DENIED)
5. **Direct Status Tampering to Terminal**: Non-editor attempting to change draft article status to published. (Expected: PERMISSION_DENIED)
6. **Fake Doctor Credential Injection**: Unauthenticated or unauthorized user writing to `/editorialReviews/doc-1`. (Expected: PERMISSION_DENIED)
7. **Junk ID Poisoning**: Attempting to create an article with ID containing 2000 invalid characters. (Expected: PERMISSION_DENIED)
8. **Client Timestamp Spoofing**: Attempting to set `createdAt: '2020-01-01'` instead of `request.time`. (Expected: PERMISSION_DENIED)
9. **Category Mutation**: Attempting to alter or delete any of the 7 approved categories. (Expected: PERMISSION_DENIED)
10. **Media Overwrite**: Non-owner or non-admin attempting to delete or overwrite another editor's uploaded media. (Expected: PERMISSION_DENIED)
11. **Site Settings Hijack**: Unauthorized client writing to `/siteSettings/global`. (Expected: PERMISSION_DENIED)
12. **PII Blanket Leak**: Unauthorized user attempting to read another user's private profile in `/users/{userId}`. (Expected: PERMISSION_DENIED)
