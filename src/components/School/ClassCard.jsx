import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import axios from "axios";

const ClassCard = ({ school, onAddSection }) => {
  const { id: schoolId, name, sections } = school;

  const handleAddSection = async () => {
    try {
      await axios.post(
        `http://localhost:8000/ilp/v1/schools/${schoolId}/sections`,
        {
          section: "New Section",
          teacher: "New Teacher",
          students: 0,
        }
      );
      onAddSection(schoolId);
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Button variant="outlined" color="primary" onClick={handleAddSection}>
          Add Section
        </Button>
        {sections?.length > 0 ? (
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Section</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>No. of Students</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.map((sectionData) => (
                <TableRow key={sectionData.id}>
                  <TableCell>{sectionData.section}</TableCell>
                  <TableCell>{sectionData.teacher}</TableCell>
                  <TableCell>{sectionData.students}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body2" sx={{ mt: 2 }}>
            No sections available. Add sections to manage this school.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

ClassCard.propTypes = {
  school: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        section: PropTypes.string.isRequired,
        teacher: PropTypes.string.isRequired,
        students: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  onAddSection: PropTypes.func.isRequired,
};

export default ClassCard;
