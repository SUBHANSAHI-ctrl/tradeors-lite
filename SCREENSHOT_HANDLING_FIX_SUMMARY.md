# Screenshot Handling Fix Summary - TraderOS Lite

## Changes Made

### 1. addTrade Function Changes
**Location:** `src/hooks/useTrades.ts` (lines ~50-60)

**Before:**
```typescript
const payload = {
  ...tradeDataWithoutFile,
  screenshot_url: screenshotUrl
}
```

**After:**
```typescript
const payload = {
  ...tradeDataWithoutFile,
  screenshot_url: screenshotUrl || null
}
```

**What this does:**
- Ensures addTrade ALWAYS sends a screenshot_url field to the API
- Uses `null` instead of `undefined` when no screenshot is provided
- Maintains the screenshot URL when an image is successfully uploaded
- Provides a clean null value when no image is uploaded

### 2. updateTrade Function Changes
**Location:** `src/hooks/useTrades.ts` (lines ~110-120)

**Before:**
```typescript
const payload = {
  ...tradeDataWithoutFile,
  screenshot_url: screenshotUrl
}
```

**After:**
```typescript
const payload = {
  ...tradeDataWithoutFile,
  ...(screenshotUrl ? { screenshot_url: screenshotUrl } : {}),
}
```

**What this does:**
- Only includes screenshot_url in the payload when a new image was uploaded
- Preserves existing screenshot_url when no new image is provided
- Uses conditional spread to avoid sending null/undefined values
- Ensures existing screenshots are never overwritten with null

## Technical Behavior

### addTrade Function
- ✅ **Always sends screenshot_url**: Whether image uploaded or not
- ✅ **Uses null fallback**: screenshot_url is never undefined
- ✅ **Maintains upload logic**: Still uploads images when provided
- ✅ **Clean API calls**: Consistent payload structure

### updateTrade Function
- ✅ **Conditional screenshot updates**: Only updates when new image uploaded
- ✅ **Preserves existing screenshots**: Never overwrites with null
- ✅ **Clean conditional logic**: Uses spread operator for clean inclusion
- ✅ **Backward compatible**: Works with existing trade updates

## Result

The implementation now provides:
- **addTrade**: Always stores screenshot_url (either URL or null)
- **updateTrade**: Only updates screenshot_url when new image uploaded
- **Existing screenshots**: Preserved during updates without new images
- **Clean API payloads**: No undefined values, consistent structure

This ensures that new trades always have a screenshot_url field, while updates only modify the screenshot when a new image is actually uploaded, preserving existing screenshots during other trade field updates.