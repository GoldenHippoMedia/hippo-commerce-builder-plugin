// page-details-dialog.component.tsx
import React, { useRef, useEffect, useState } from "react";
import { HiX } from 'react-icons/hi';
import { PageDetails } from "@utils/utils.interfaces";
import PageDetailCard from "@components/page-details.component";
import { IProduct } from "@services/commerce-api/types";

interface Props {
  page: PageDetails;
  onClose: () => void;
  products: IProduct[];
}

function PageDetailsDialog({ page, onClose, products }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (page) {
      modalRef.current?.showModal();
    }
  }, [page]);

  const handleClose = () => {
    modalRef.current?.close();
    onClose();
  };

  return (
    <dialog ref={modalRef} className="modal" onClose={onClose}>
      <div className="modal-box max-w-7xl w-full max-h-[90vh] p-0">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
          onClick={handleClose}
        >
          <HiX className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          <PageDetailCard page={page} onClose={handleClose} products={products} />
        </div>
      </div>

      {/* Click backdrop to close */}
      <form method="dialog" className="modal-backdrop bg-black/20 backdrop-blur-md">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}

export default PageDetailsDialog;
