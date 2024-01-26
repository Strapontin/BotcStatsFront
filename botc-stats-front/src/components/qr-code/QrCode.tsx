/* eslint-disable jsx-a11y/alt-text */
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useQRCode } from "next-qrcode";

export default function QrCode({ text }: { text: string }) {
  const { Image } = useQRCode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const QrImage = ({ width }: { width: number }): JSX.Element => {
    return (
      <Image
        text={text}
        options={{
          type: "image/jpeg",
          quality: 0.3,
          errorCorrectionLevel: "M",
          margin: 3,
          scale: 4,
          width: width,
          color: {
            dark: "#000",
            light: "#fff",
          },
        }}
      />
    );
  };

  return (
    <div>
      <div className="cursor-pointer" onClick={onOpen}>
        <QrImage width={50} />
      </div>
      <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Code QR de la page actuelle</ModalHeader>
              <ModalBody>
                <QrImage width={700} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
