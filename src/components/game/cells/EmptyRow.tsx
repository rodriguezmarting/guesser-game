import { EmptyCell } from "./EmptyCell";
import { Row } from "./Row";

export function EmptyRow() {
  return (
    <Row>
      <EmptyCell />
      <EmptyCell />
      <EmptyCell />
      <EmptyCell />
      <EmptyCell />
      <EmptyCell />
      <EmptyCell />
    </Row>
  );
}
