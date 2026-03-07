import React, { useEffect, useReducer, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import "./Interview.css";
import video from "../../assets/istockphoto-1578508100-640_adpp_is.mp4";
import { useSpeechRecognition } from "react-speech-kit";
import MicIcon from "@mui/icons-material/Mic";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import LoadingButton from "@mui/lab/LoadingButton";
const Compo = () => {
  return <>hi</>;
};

const NewQuestion = ({ idx, questions, responses }) => {
  return (
    <>
      <div className="font-bold mb-3">
        {`Question-${idx + 1}: ${questions[idx].question}`}
      </div>
    </>
  );
};

const NewResponse = ({ responses, idx }) => {
  return (
    <>
      <div className=" mb-3">
        {`Answer-${idx + 1}: ${responses[idx].answer}`}
      </div>
    </>
  );
};

function Interview() {
  const { id } = useParams();
  const [value, setValue] = React.useState("");
  const [disableAll, setDisableAll] = React.useState(true);
  const [disablePlay, setDisablePlay] = React.useState(false);
  const [isListening, setIsListening] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [count, setCount] = useState(0);
  const videoRef = React.useRef(null);
  const [isSubmitting, setSubmitting] = useState(false);

  // Note: Speech recognition is handled via react-speech-kit (useSpeechRecognition below)

  const data = JSON.parse(localStorage.getItem("dataList") || "[]");
  // const {isListening,transcript, startListening, stopListening} = useVoiceCollector();
  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      setValue(result); // Update the value when speech is recognized
    },
  });

  const playVideo = () => {
    videoRef.current.play();
    setDisablePlay(true);
  };
  const [questions, setQuestions] = useState();
  const [loader, setLoader] = useState(true);
  const [components, setComponents] = useState([]);
  const [responses, setResponses] = useState([]);

  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const handleEnded = () => {
    // isListening(true);
    setVideoEnded(true);
    setDisableAll(false);
    // setIsListening(true);
    // start();
  };

  const nothing = () => {
    if (responses.length < components.length) {
      setResponses([
        ...responses,
        { question: questions[questions.length - 1].question, answer: value },
      ]);
      setValue("");
      setIsListening(false);
      stop();
    }
  };

  const addComponent = () => {
    setDisableAll(true);
    // setIsListening(false);
    stop();
    setVideoUrl(questions[count + 1].videoUrl);
    setCount((prev) => prev + 1);
    setResponses([
      ...responses,
      { question: questions[count].question, answer: value },
    ]);
    setValue("");
    setComponents([
      ...components,
      <NewQuestion
        key={components.length}
        idx={components.length}
        questions={questions}
        responses={responses}
      />,
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // werwerwer
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/iv/getQuestions`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/iv/getIV`,
          { interviewId: id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const iv = res.data.data[0];
        let temp = [];
        if (iv.skills.toLowerCase().includes("c++")) {
          temp.push("c++");
        }
        if (iv.skills.toLowerCase().includes("python")) {
          temp.push("python");
        }
        if (iv.skills.toLowerCase().includes("javascript")) {
          temp.push("js");
        }
        // console.log(temp, data.data[0].type);
        let temp2 = [];
        let finals = [];
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i]?.type === "basic" && finals.length === 0) {
            finals.push(data.data[i]);
          } else {
            if (temp.includes(data.data[i]?.type)) {
              temp2.push(data.data[i]);
            }
          }
          // console.log(data.data[i].type, i);
        }
        // console.log('temp2', temp2);
        // Guard: clamp count to available questions to avoid infinite loop
        const safeCount = Math.min(iv.count, temp2.length);
        let indices = [];
        for (let i = 0; i < safeCount; i++) {
          let idx = Math.floor(Math.random() * temp2.length);
          let attempts = 0;
          while (indices.includes(idx) && attempts < temp2.length * 2) {
            idx = Math.floor(Math.random() * temp2.length);
            attempts++;
          }
          indices.push(idx);
          finals.push(temp2[idx]);
        }
        // if (!questions) {
        // console.log(finals);
        setQuestions(finals);
        // }
        // else {
        //   console.log(questions);
        // }
        setVideoUrl(finals[0].videoUrl);
        setComponents([
          <NewQuestion
            key={0}
            idx={0}
            questions={finals}
            responses={responses}
          />,
        ]);
        setLoading(false);
      } catch (e) {
        console.log(e.message);
      } finally {
        setLoader(false);
      }
    };
    if (loader) {
      fetchData();
    }
  }, [id]);
  const navigateTo = useNavigate();
  return (
    <>
      {loading ? (
        ""
      ) : (
        <>
          {loader || data?.length !== 0 ? (
            <div className="w-full text-center h-[100vh] flex items-center flex-col justify-center font-bold">
              <div>{`You might have done with the interview already!!!`}</div>
            </div>
          ) : (
            <div className="mainUI">
              <div className="text-center text-lg p-1 font-bold">Interview</div>
              <div className="grid grid-cols-12 !h-full">
                <Box
                  sx={{
                    width: 500,
                    height: 500,
                    borderRadius: 5,
                  }}
                  className="rounded-lg px-2 col-span-5 ml-3 !w-full !h-full"
                >
                  <video
                    controls={false}
                    ref={videoRef}
                    onEnded={handleEnded}
                    onError={handleEnded}
                    className="h-full w-full"
                    autoPlay
                    src={videoUrl}
                    crossOrigin="anonymous"
                  >
                    Your browser does not support HTML video.
                  </video>
                  <div className="flex justify-center">
                    {disablePlay ? (
                      ""
                    ) : (
                      <Button
                        className="absolute bottom-16"
                        onClick={playVideo}
                        variant="contained"
                        disabled={disablePlay}
                      >
                        Start Interview
                      </Button>
                    )}
                  </div>
                </Box>
                <Box
                  sx={{
                    width: 500,
                    height: 500,
                    borderRadius: 5,
                  }}
                  className="rounded-lg p-5 col-span-7 !w-full !h-full"
                >
                  <div className="h-[600px] w-full p-5 bg-gray-200 rounded-lg  overflow-y-scroll">
                    {components.map((cmp, i) => {
                      return (
                        <div key={i}>
                          {cmp}
                          {responses.length > i ? (
                            <NewResponse responses={responses} idx={i} />
                          ) : (
                            <></>
                          )}
                        </div>
                      );
                    })}
                    <textarea
                      className="w-full mt-4 p-3 border-2 border-gray-400 rounded-md shadow-sm"
                      rows={4}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Your spoken answer will appear here, or you can type your answer manually..."
                    />
                  </div>
                  <div className="flex justify-center">
                    {responses?.length === questions?.length ? (
                      <>
                        {isSubmitting ? (
                          <LoadingButton
                            variant="contained"
                            type="button"
                            loading
                          >
                            Submit
                          </LoadingButton>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={async () => {
                              console.log(responses);
                              setSubmitting(true);
                              const res = await axios.post(
                                `${import.meta.env.VITE_API_BASE_URL}/iv/uploadResponses`,
                                { interviewId: id, answers: responses },
                                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                              );
                              const data = await axios.post(
                                `${import.meta.env.VITE_API_BASE_URL}/ai/checkAnswers`,
                                { responses },
                                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                              );
                              localStorage.setItem("interviewId", id);
                              localStorage.setItem(
                                "dataList",
                                JSON.stringify(responses)
                              );
                              localStorage.setItem(
                                "scores",
                                JSON.stringify(data.data.data)
                              );
                              navigateTo("/feedback");
                              setSubmitting(false);
                            }}
                          >
                            Submit
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-row">
                        <div>
                          <button
                            disabled={disableAll}
                            className="text-lg"
                            onClick={(e) => {
                              e.preventDefault();
                              // startStopListening();
                              if (isListening) {
                                setIsListening(false);
                                stop();
                                // addComponent();
                                if (count === questions.length - 1) {
                                  nothing();
                                } else {
                                  addComponent();
                                }
                              } else {
                                setIsListening(true);
                                listen();
                              }
                            }}
                          >
                            <MicIcon
                              fontSize="large"
                              sx={{ color: `${isListening ? "red" : "black"}` }}
                            />
                          </button>
                          {/* <Compo /> */}
                        </div>
                        {/* <Button className='' variant="contained" onClick={(count === questions.length - 1) ? nothing : addComponent} type='button' disabled={((responses.length === questions.length) || (disableAll)) ? true : false}>Save</Button> */}
                      </div>
                    )}
                  </div>
                </Box>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Interview;


// import React, { useEffect, useRef, useState } from "react";
// import { Box, Button } from "@mui/material";
// import MicIcon from "@mui/icons-material/Mic";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import LoadingButton from "@mui/lab/LoadingButton";

// // Component for displaying questions
// const NewQuestion = ({ idx, questions }) => {
//   return (
//     <div className="font-bold mb-3">
//       {`Question-${idx + 1}: ${questions[idx].question}`}
//     </div>
//   );
// };

// // Component for displaying responses
// const NewResponse = ({ responses, idx }) => {
//   return (
//     <div className="mb-3">
//       {`Answer-${idx + 1}: ${responses[idx].answer}`}
//     </div>
//   );
// };

// function Interview() {
//   const { id } = useParams();
//   const [value, setValue] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [videoEnded, setVideoEnded] = useState(false);
//   const [count, setCount] = useState(0);
//   const videoRef = useRef(null);
//   const [isSubmitting, setSubmitting] = useState(false);
//   const [questions, setQuestions] = useState([]);
//   const [loader, setLoader] = useState(true);
//   const [components, setComponents] = useState([]);
//   const [responses, setResponses] = useState([]);
//   const [videoUrl, setVideoUrl] = useState("");
//   const recognitionRef = useRef(null); // Store recognition instance

//   const navigateTo = useNavigate();

//   // Initialize SpeechRecognition (with webkitSpeechRecognition fallback for Chrome)
//   useEffect(() => {
//     if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
//       const SpeechRecognition =
//         window.SpeechRecognition || window.webkitSpeechRecognition;
//       const recognition = new SpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = "en-US";

//       recognition.onresult = (event) => {
//         const transcript = Array.from(event.results)
//           .map((result) => result[0].transcript)
//           .join("");
//         setValue(transcript); // Update the transcribed text
//       };

//       recognition.onend = () => {
//         console.log("Speech recognition ended.");
//         setIsListening(false);
//       };

//       recognitionRef.current = recognition; // Store the instance
//     } else {
//       alert(
//         "Your browser does not support speech recognition. Please use Google Chrome."
//       );
//     }
//   }, []);

//   // Function to start listening
//   const startListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   // Function to stop listening
//   const stopListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }
//   };

//   const playVideo = () => {
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//   };

//   // Fetch questions and video URL from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get(
//           "https://lisa-node-backend.onrender.com/iv/getQuestions"
//         );
//         const res = await axios.post(
//           "https://lisa-node-backend.onrender.com/iv/getIV",
//           { interviewId: id }
//         );
//         const iv = res.data.data[0];
//         let temp = [];
//         if (iv.skills.toLowerCase().includes("c++")) {
//           temp.push("c++");
//         }
//         if (iv.skills.toLowerCase().includes("python")) {
//           temp.push("python");
//         }
//         if (iv.skills.toLowerCase().includes("javascript")) {
//           temp.push("js");
//         }

//         let temp2 = [];
//         let finals = [];
//         for (let i = 0; i < data.data.length; i++) {
//           if (data.data[i]?.type === "basic" && finals.length === 0) {
//             finals.push(data.data[i]);
//           } else {
//             if (temp.includes(data.data[i]?.type)) {
//               temp2.push(data.data[i]);
//             }
//           }
//         }

//         let indices = [];
//         for (let i = 0; i < iv.count; i++) {
//           let idx = Math.floor(Math.random() * temp2.length);
//           while (indices.includes(idx)) {
//             idx = Math.floor(Math.random() * temp2.length);
//           }
//           indices.push(idx);
//           finals.push(temp2[idx]);
//         }

//         setQuestions(finals);
//         setVideoUrl(finals[0]?.videoUrl || "");
//         setComponents([<NewQuestion key={0} idx={0} questions={finals} />]);
//       } catch (e) {
//         console.error(e.message);
//       } finally {
//         setLoader(false); // Stop loading
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (loader) {
//     return <div>Loading...</div>; // Fallback UI while data is loading
//   }

//   return (
//     <div className="mainUI">
//       <div className="text-center text-lg p-1 font-bold">Interview</div>
//       <div className="grid grid-cols-12 !h-full">
//         <Box
//           sx={{
//             width: 500,
//             height: 500,
//             borderRadius: 5,
//           }}
//           className="rounded-lg px-2 col-span-5 ml-3 !w-full !h-full"
//         >
//           <video controls={false} ref={videoRef} className="h-full w-full">
//             <source id="hr-vdo" src={videoUrl} type="video/mp4" />
//             Your browser does not support HTML video.
//           </video>
//           <div className="flex justify-center">
//             <Button
//               className="absolute bottom-16"
//               onClick={playVideo}
//               variant="contained"
//             >
//               Start Interview
//             </Button>
//           </div>
//         </Box>
//         <Box
//           sx={{
//             width: 500,
//             height: 500,
//             borderRadius: 5,
//           }}
//           className="rounded-lg p-5 col-span-7 !w-full !h-full"
//         >
//           <div className="h-[600px] w-full p-5 bg-gray-200 rounded-lg overflow-y-scroll">
//             {components.map((cmp, i) => (
//               <div key={i}>
//                 {cmp}
//                 {responses.length > i && (
//                   <NewResponse responses={responses} idx={i} />
//                 )}
//               </div>
//             ))}
//             <div>{value}</div> {/* Display the transcribed text */}
//           </div>
//           <div className="flex justify-center">
//             <Button
//               variant="contained"
//               onClick={() => {
//                 if (isListening) {
//                   stopListening();
//                 } else {
//                   startListening();
//                 }
//                 setIsListening(!isListening);
//               }}
//             >
//               {isListening ? "Stop Listening" : "Start Listening"}
//             </Button>
//           </div>
//         </Box>
//       </div>
//     </div>
//   );
// }

// export default Interview;

