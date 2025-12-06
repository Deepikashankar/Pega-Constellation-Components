import { withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';

interface BdExtnCaseFileDownloadProps extends PConnFieldProps {
  title: string;
  description: string;
  linkLabel: string;
  filePath: string;
  extension: string;
  fileName: string;
  dynamicFileName?: string;

  headerColor?: string;
  headerSize?: string;
  headerBold?: boolean;

  descriptionColor?: string;
  descriptionSize?: string;
  descriptionBold?: boolean;

  linkColor?: string;
  linkSize?: string;
  linkBold?: boolean;
}

interface FileResponse {
  pyContents: string;
  [key: string]: any;
}

function BdExtnCaseFileDownload(props: BdExtnCaseFileDownloadProps) {
  const {
    title,
    description,
    linkLabel,
    filePath,
    extension,
    fileName,
    dynamicFileName,
    headerColor,
    headerSize,
    headerBold,
    descriptionColor,
    descriptionSize,
    descriptionBold,
    linkColor,
    linkSize,
    linkBold,
    getPConnect
  } = props;

  const handleDownload = async () => {
    try {
      const dataPageName = 'D_MDHGetFile';
      const context = getPConnect()?.getContextName?.() || 'app/primary_1';
      const parameters = {
        repositoryName: 'pegacloudrepository',
        filePath,
        responseType: 'STRING'
      };

      const response = (await (window as any).PCore.getDataPageUtils().getPageDataAsync(
        dataPageName,
        context,
        parameters,
        { invalidateCache: true }
      )) as FileResponse;

      if (response?.pyContents) {
        const byteCharacters = atob(response.pyContents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i += 1) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const mimeTypes: Record<string, string> = {
          pdf: 'application/pdf',
          xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          xls: 'application/vnd.ms-excel',
          docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          doc: 'application/msword',
          txt: 'text/plain',
          csv: 'text/csv',
          json: 'application/json',
          png: 'image/png',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg'
        };

        const mimeType = mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
        const blob = new Blob([byteArray], { type: mimeType });

        // Dynamic or default filename
        let resolvedFileName = fileName || 'download';
        if (dynamicFileName) {
          try {
            const pConnect = getPConnect?.();
            const dynamicValue = pConnect?.getValue(dynamicFileName);
            if (dynamicValue) resolvedFileName = dynamicValue;
          } catch (err) {
            console.warn('Unable to resolve dynamic file name:', err);
          }
        }

        const hasExtension = resolvedFileName
          .toLowerCase()
          .endsWith(`.${extension.toLowerCase()}`);
        const finalFileName = hasExtension
          ? resolvedFileName
          : `${resolvedFileName}.${extension}`;

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = finalFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('No pyContents found in data page response');
      }
    } catch (err) {
      console.error('Error fetching file:', err);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
      {title && (
        <h3
          style={{
            color: headerColor || '#000000',
            fontSize: `${headerSize || 18}px`,
            fontWeight: headerBold ? 'bold' : 'normal',
            margin: '0 0 8px 0'
          }}
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          style={{
            color: descriptionColor || '#333333',
            fontSize: `${descriptionSize || 14}px`,
            fontWeight: descriptionBold ? 'bold' : 'normal',
            margin: '0 0 12px 0'
          }}
        >
          {description}
        </p>
      )}
      <a
        onClick={handleDownload}
        style={{
          color: linkColor || 'blue',
          fontSize: `${linkSize || 14}px`,
          fontWeight: linkBold ? 'bold' : 'normal',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        {linkLabel}
      </a>
    </div>
  );
}

export default withConfiguration(BdExtnCaseFileDownload);
