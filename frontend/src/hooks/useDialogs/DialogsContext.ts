import * as React from 'react';
import type { OpenDialog, CloseDialog } from './useDialogs';

const DialogsContext = React.createContext<{
  open: OpenDialog;
  close: CloseDialog;
} | null>(null);

export default DialogsContext;

///my custom code 
// export const DialogsProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const open: OpenDialog = async (Component, payload) => {
//     your real implementation
//   };

//   const close: CloseDialog = async (result) => {
//     your real implementation
//   };

//   return (
//     <DialogsContext.Provider value={{ open, close }}>
//       {children}
//     </DialogsContext.Provider>
//   );
// };

