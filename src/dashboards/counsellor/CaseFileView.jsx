import React from 'react';
import CounsellingCaseViewSecure from './CounsellingCaseViewSecure';

// Compatibility wrapper. All counselling case data access now occurs through
// server-side APIs; this component contains no direct Firestore reads/writes.
const CaseFileView = (props) => <CounsellingCaseViewSecure {...props} />;

export default CaseFileView;
