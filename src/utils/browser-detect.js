/**
 * Pure JavaScript browser detection to replace detect-browser
 * Focused on iOS Safari detection for this specific use case
 */

function detectBrowser() {
  // Handle non-browser environments
  if (typeof navigator === 'undefined') {
    return {
      name: 'unknown',
      os: 'unknown',
      version: '0.0.0'
    };
  }
  
  const userAgent = navigator.userAgent;
  
  // Check if this is iOS Safari
  const isIPhoneOrIPod = /iPhone|iPod/.test(userAgent);
  const isIPad = /iPad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isIOS = isIPhoneOrIPod || isIPad;
  
  // Check if it's Safari (not Chrome or other browsers on iOS)
  const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
  
  if (isIOS && isSafari) {
    // Extract iOS version from user agent
    let version = '15.0'; // Default fallback
    const versionMatch = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (versionMatch) {
      const major = versionMatch[1];
      const minor = versionMatch[2] || '0';
      const patch = versionMatch[3] || '0';
      version = `${major}.${minor}.${patch}`;
    }
    
    return {
      name: 'ios',
      os: 'iOS',
      version: version
    };
  }
  
  // Return null or generic info for non-iOS Safari browsers
  return {
    name: 'unknown',
    os: 'unknown',
    version: '0.0.0'
  };
}

export { detectBrowser as detect };