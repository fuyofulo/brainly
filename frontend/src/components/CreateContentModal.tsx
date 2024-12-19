import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { BACKEND_URL } from "../config";
import axios from "axios";

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

// Controlled Component
export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    await axios.post(
      `${BACKEND_URL}/api/v1/content`,
      {
        link,
        title,
        type,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    onClose();
  }

  return (
    <div>
      {open && (
        <div>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
              {/* Close Icon */}
              <div
                className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-800"
                onClick={onClose}
              >
                <CrossIcon />
              </div>

              {/* Modal Content */}
              <h2 className="text-2xl font-semibold text-center mb-6">
                Create Content
              </h2>
              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    ref={titleRef}
                    id="title"
                    type="text"
                    placeholder="Enter title"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Link Input */}
                <div>
                  <label
                    htmlFor="link"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Link
                  </label>
                  <input
                    ref={linkRef}
                    id="link"
                    type="text"
                    placeholder="Enter link"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Content Type Selection */}
                <div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      text="Youtube"
                      variant={type === ContentType.Youtube ? "primary" : "secondary"}
                      onClick={() => setType(ContentType.Youtube)}
                    />
                    <Button
                      text="Twitter"
                      variant={type === ContentType.Twitter ? "primary" : "secondary"}
                      onClick={() => setType(ContentType.Twitter)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center flex justify-center">
                  <Button onClick={addContent} variant="primary" text="Submit" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
