let user = window.user || {}, org = window.org || {};

export const isAdmin = () => user.type == 'admin' || user.type == 'subadmin';
export const onlyAdmin = () => user.type == 'admin';

export const hasFeature = (fn) => org.features && org.features[fn] == 1;
