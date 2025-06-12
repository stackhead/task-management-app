# Appwrite Collection Setup

## PREFERENCES_COLLECTION_ID Setup

1. Go to your Appwrite Console
2. Navigate to Databases > Your Database
3. Create a new collection called "preferences"
4. Add the following attributes:

### Attributes:
- `userId` (String, Required) - User ID reference
- `language` (String, Optional) - User's preferred language
- `timeZone` (String, Optional) - User's timezone
- `theme` (String, Optional) - UI theme preference
- `dateFormat` (String, Optional) - Date format preference
- `timeFormat` (String, Optional) - Time format preference
- `weekFormat` (String, Optional) - Week start preference
- `showOrgTasks` (Boolean, Optional) - Show organization tasks
- `browserNotifications` (Boolean, Optional) - Browser notifications enabled

### Permissions:
Set the following permissions for the preferences collection:

**Read permissions:**
- `user:[USER_ID]` (Users can read their own preferences)

**Write permissions:**
- `user:[USER_ID]` (Users can create/update their own preferences)

**Delete permissions:**
- `user:[USER_ID]` (Users can delete their own preferences)

## Alternative: Use any() permissions for testing
If you're having permission issues during development, you can temporarily use:
- Read: `any()`
- Write: `any()`
- Delete: `any()`

**Remember to change these to proper user-specific permissions in production!**
