import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Collapse from "react-bootstrap/Collapse";
import { CaretDown } from "react-bootstrap-icons";
import Card from "react-bootstrap/Card";
import React from "react";
import moment from "moment";

//Create a drop element
function Drop({
  streamer_name,
  item_name,
  item_icon,
  itemdefid,
  unlock_condition,
}) {

  return (
    <Container>
      <Row>
        <Image
          style={{
            height: "300px",
            width: "300px",
          }}
          src={item_icon}
          alt="Image"
        />
      </Row>
      <Row
        style={{
          backgroundColor: "#232050",
          height: "215px",
          padding: "3px",
        }}
      >
        <Row>
          <p>Streamer: {streamer_name}</p>
        </Row>
        <Row>
          <p>Item Name: {item_name}</p>
        </Row>
        <Row>
          <p>Unlock Condition: {unlock_condition}</p>
        </Row>
        <Row>
          <p>PLACEHOLDER FOR CLAIM STATUS</p>
        </Row>
      </Row>
    </Container>
  );
}

//Mapping each current drop to a drop element in a grid layout
function CurrentDropsList({ drops }) {
  if (!drops.length) return <div>No Drops available.</div>;

  const dropList = [];

  drops.map((dropInfo) => dropList.push(dropInfo));

  console.log(dropList);

  return (
    <>
      <Container>
        <p className="text-white h2 mt-4 mb-3">Current Drops</p>
        <p className="text-white">
          Watch streams to earn in-game rewards
        </p>
        {dropList.map((drops) => {
          const end = new Date(drops.end_date);
          console.log(end);

          return (
            <Container className="block-example border-top border-white mt-3">
              <Row>
                <p className="text-white h5  mt-4 mb-3">{drops.name}</p>
                <Countdown timeTillDate={end} timeFormat="MM DD YYYY, h:mm a" />
              </Row>
              <Row>
                {drops.drops.map((drop) => {
                  return (
                    <Col
                      sm="auto"
                      md={6}
                      lg={8}
                      className="dropContainer mx-auto"
                    >
                      <Drop key={drop.itemdefid} {...drop} />
                    </Col>
                  );
                })}
              </Row>
            </Container>
          );
        })}
      </Container>
    </>
  );
}

//Mapping each future drop to a drop element in a grid layout
function FutureDropsList({ drops }) {
  if (!drops.length) return <div>No Drops available.</div>;

  const dropList = [];

  drops.map((dropInfo) => dropList.push(dropInfo));

  console.log(dropList);

  return (
    <>
      <Container>
        <p className="text-white h2  mt-4 mb-3">Future Drops</p>
        {dropList.map((drops) => {
          const start = new Date(drops.start_date);
          const startDate = start.toDateString();
          return (
            <Container className="block-example border-top border-white mt-5">
              <Row>
                <p className="text-white h5  mt-4 mb-3">{drops.name}</p>
                <p className="text-white mt-2 mb-3">Starts: {startDate}</p>
              </Row>
              <Row>
                {drops.drops.map((drop) => {
                  return (
                    <Col
                      sm="auto"
                      md={6}
                      lg={8}
                      className="dropContainer mx-auto"
                    >
                      <Drop key={drop.itemdefid} {...drop} />
                    </Col>
                  );
                })}
              </Row>
            </Container>
          );
        })}
      </Container>
    </>
  );
}

//Mapping each previous drop to a drop element in a grid layout
function PreviousDropsList({ drops }) {
  if (!drops.length) return <div>No Drops available.</div>;

  const dropList = [];

  drops.map((dropInfo) => dropList.push(dropInfo));

  console.log(dropList);

  return (
    <>
      <Container>
        <p className="text-white h2  mt-4 mb-3">Previous Drops</p>
        {dropList.map((drops) => {
          const start = new Date(drops.start_date);
          const startDate = start.toDateString();
          const end = new Date(drops.end_date);
          const endDate = end.toDateString();
          return (
            <Container className="block-example border-top border-white mt-5">
              <Row>
                <p className="text-white h5  mt-4 mb-3">{drops.name}</p>
                <p className="text-white mt-2 mb-3">
                  Was available from: {startDate} - {endDate}
                </p>
              </Row>
              <Row>
                {drops.drops.map((drop) => {
                  return (
                    <Col
                      sm="auto"
                      md={6}
                      lg={8}
                      className="dropContainer mx-auto"
                    >
                      <Drop key={drop.itemdefid} {...drop} />
                    </Col>
                  );
                })}
              </Row>
            </Container>
          );
        })}
      </Container>
    </>
  );
}

//The home page which displays current drops
export function Home() {
  const [currentDrops, setDrops] = useState([]);
  useEffect(() => {
    fetch("/api/getCurrentDrops")
      .then((response) => response.json())
      .then(setDrops);
  }, []);
  //console.log(drops);

  return (
    <div className="App">
      <Header />
      <div>
        <CurrentDropsList drops={currentDrops} />
      </div>
      <PageFooter />
    </div>
  );
}

//The previous drops page which displays previous drops
export function Previous() {
  const [previousDrops, setPreviousDrops] = useState([]);
  useEffect(() => {
    fetch("/api/getPreviousDrops")
      .then((response) => response.json())
      .then(setPreviousDrops);
  }, []);
  //console.log(previousDrops);

  return (
    <div className="App">
      <Header />
      <div>
        <PreviousDropsList drops={previousDrops} />
      </div>
      <PageFooter />
    </div>
  );
}

//The future drops page which displays future drops
export function Future() {
  const [futureDrops, setFutureDrops] = useState([]);
  useEffect(() => {
    fetch("/api/getFutureDrops")
      .then((response) => response.json())
      .then(setFutureDrops);
  }, []);
  return (
    <div className="App">
      <Header />
      <div>
        <FutureDropsList drops={futureDrops} />
      </div>
      <PageFooter />
    </div>
  );
}

//Creates a faq element to be used to display a faq from the database
function Faq({ question, answer }) {
  const [open, setOpen] = useState(false);

    return (
      <>
        <Row>
          <Card className="bg-dark">
            <Card.Body>
              <Card.Title className="text-white">
                {question}{" "}
                <Button
                  onClick={() => setOpen(!open)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open}
                  className="bg-dark text-white "
                >
                  <CaretDown />
                </Button>
              </Card.Title>
                <Collapse in={open}>
                  <Container className="text-white">
                    {answer}
                  </Container>
                </Collapse>
            </Card.Body>
          </Card>
        </Row>
      </>
    );
  }

//Mapping each faq to a faq element
function FaqsList({ faqs = [] }) {
    if (!faqs.length) return <div>No FAQs available.</div>;

    return (
      <>
        {faqs.map((faq) => (
          <Faq key={faq.question} {...faq} />
        ))}
      </>
    );
  }  

//The faq page which displays all the faqs from the database in a single column
export function Faqs() {
  const [faqs, setFaqs] = useState([]);
  useEffect(() => {
    fetch("/api/getFaqs")
      .then((response) => response.json())
      .then(setFaqs);
  }, []);
  //console.log(faqs);

  return (
    <>
      <div className="App">
        <Header />
        <p className="text-white h2 mt-4 mb-3">FAQs</p>
        <Container className="block-example border-top border-white mt-5">
          <Col className="mt-3">
            <FaqsList faqs={faqs} />
          </Col>
        </Container>
        <PageFooter />
      </div>
    </>
  );
}

//The Connect page which features two buttons for connecting to twitch and steam accounts
export function Connect() {

  return (
    
    <div className="App">
      <Header />
      <Container>
        <Row className="block-example border-bottom border-white">
          <p className="text-white h2 mt-4 mb-3">Pair Account</p>
          <p className="text-white">
            Pair your <strong>Steam</strong> account and{" "}
            <strong>Twitch</strong> account to begin claiming drops!
          </p>
        </Row>
        <Row className="mt-5">
          <Col className="mt-3" sm={12} md={6}>
            <Button> <Image src="/images/twitch_logo.png" /> SIGN IN WITH{" "}
              <strong>TWITCH</strong></Button>
          </Col>
          <Col className="mt-3" sm={12} md={6}>
            <Button> <Image src="/images/steam_logo.png" /> SIGN IN WITH{" "}
              <strong>STEAM</strong></Button>
          </Col>
        </Row>
      </Container>
      <PageFooter />
    </div>
  );
}

//The page header containing a banner image with logo and a navbar with routes to each page
function Header() {
  return (
    <header
      style={{
        width: "100%",
      }}
    >
      <div>
        <Row className="bg-snow px-4 pt-4">
          <Image
            src="/images/pw-white-logo.svg"
            height="80px"
            alt="logo"
          ></Image>
          <p className="Heading mt-4">TWITCH DROPS</p>
        </Row>
        <Row>
          <Navbar
            className="NavBarCont"
            collapseOnSelect
            expand="md"
            variant="dark"
          >
            <Container>
              <Navbar.Toggle
                className="mx-auto"
                aria-controls="responsive-navbar-nav"
              />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="/">Current Drops </Nav.Link>
                  <Nav.Link href="/future">Upcoming</Nav.Link>
                  <Nav.Link href="/prev">Previous</Nav.Link>
                  <Nav.Link href="/faqs">FAQS</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link href="/connect">Connect Account</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Row>
      </div>
    </header>
  );
}

//The page footer which has some copyright info
function PageFooter() {
  return (
    <footer className="footer">
      <p>Copyright 2022</p>
    </footer>
  );
}

//Creates a countdown to be used on the current drops page to display how long the drops are available
class Countdown extends React.Component {
  state = {
    days: undefined,
    hours: undefined,
    minutes: undefined,
    seconds: undefined,
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      const { timeTillDate, timeFormat } = this.props;
      const then = moment(timeTillDate, timeFormat);
      const now = moment();
      const countdown = moment(then - now);
      const month = countdown.format("MM");
      const days = countdown.format("DD");
      const hours = countdown.format("HH");
      const minutes = countdown.format("mm");
      const seconds = countdown.format("ss");
      this.setState({ month, days, hours, minutes, seconds });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { month, days, hours, minutes, seconds } = this.state;

    if (!seconds) {
      return null;
    }

    return (
      <Container className="mb-3">
        <Row className="text-white mt-4 mb-3">
          <p>Time Remaining</p>
        </Row>
        <Row className="justify-content-center">
          <Col xs-md={2}>
            {month && (
              <div className="countdown-item">
                {month - 1}
                <span>month</span>
              </div>
            )}
          </Col>
          <Col xs-md={2}>
            {days && (
              <div className="countdown-item">
                {days}
                <span>days</span>
              </div>
            )}
          </Col>
          <Col xs-md={2}>
            {hours && (
              <div className="countdown-item">
                {hours}
                <span>hours</span>
              </div>
            )}
          </Col>
          <Col xs-md={2}>
            {minutes && (
              <div className="countdown-item">
                {minutes}
                <span>minutes</span>
              </div>
            )}
          </Col>
          <Col xs-md={2}>
            {seconds && (
              <div className="countdown-item">
                {seconds}
                <span>seconds</span>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
