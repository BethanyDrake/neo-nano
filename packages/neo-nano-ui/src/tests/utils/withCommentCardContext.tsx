import { createHelper } from 'souvlaki';
import { CommentCardContext, CommentCardDataEntry } from '@/lib/commentCards/CommentCard';

// eslint-disable-next-line react/display-name
export const withCommentCartContext = createHelper((data: CommentCardDataEntry) => ({ children }) => (
  <CommentCardContext.Provider value={data}>
    {children}
  </CommentCardContext.Provider>
));