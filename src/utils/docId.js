/** Normalize Mongoose _id vs legacy id in API responses. */
export function docId(doc) {
  if (!doc) return undefined;
  return doc._id ?? doc.id;
}
