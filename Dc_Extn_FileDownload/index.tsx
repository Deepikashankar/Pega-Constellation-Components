import { Card, CardHeader, CardContent, Button, withConfiguration } from "@pega/cosmos-react-core";
import type { PConnFieldProps } from "./PConnProps";
import StyledDcExtnFileDownloadWrapper from "./styles";

// Static asset import (bundled by Webpack/Vite)
import fileAsset from "./Test.xlsx";

interface DcExtnFileDownloadProps extends PConnFieldProps {
  title?: string;
}

function DcExtnFileDownload(props: DcExtnFileDownloadProps) {
  const { title = "Download File" } = props;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileAsset;
    link.download = "Test.xlsx"; // keep hardcoded filename for now
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <StyledDcExtnFileDownloadWrapper>
      <Card>
        <CardHeader>{title}</CardHeader>
        <CardContent>
          <Button variant="primary" onClick={handleDownload}>
            {title}
          </Button>
        </CardContent>
      </Card>
    </StyledDcExtnFileDownloadWrapper>
  );
}

export default withConfiguration(DcExtnFileDownload);
