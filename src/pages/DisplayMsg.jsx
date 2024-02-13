import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API } from '../API';
import DeleteIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { Button, Checkbox, Tooltip, Typography } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { star_message } from '../redux/starSlice';
import { useDispatch } from 'react-redux';
import StarIcon from '@mui/icons-material/Star';
import { TopBar } from './TopBar';
import Navbar from './Navbar';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Avatar } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const style1 = {
    overflow: "scroll",
    textindent: "50px",
    border: "1px solid #808080",
    bgcolor: "#D0D0D0",
    height: 300

}
function DisplayMsg() {
    const dispatch = useDispatch()
    const [message, setMessage] = useState([])
    const [remove, setRemove] = useState(false);
    const [send, setSend] = useState(false);
    const [star, setStar] = useState([])
    const [modal, setModal] = useState([])
    const items = JSON.parse(localStorage.getItem('email'));
    const result = { items }
    useEffect(() => {
        axios.post(`${API}/gmail/getting-msg`, result)
            .then((res) => {
                setMessage(res.data)
                setSend(prev => !prev)
        })
           

    }, [send], [remove])
    const handleClose = () => setOpen(false);
    const [open, setOpen] = useState(false);
    const handleOpen = (val) => {
        setOpen(true)
        setModal(val)
    };
    const handleDelete = async (id) => {
        const newdata = {
            id
        }
        await axios.post(`${API}/info/delete`, id)
            .then((res) => console.log(res.data))

        await axios.post(`${API}/gmail/deleting-msg`, newdata)
            .then((res) => alert(res.data))
        setRemove(prev => !prev);
    }

    const handleStar = async (id) => {
        dispatch(star_message(id))
        console.log(id)
        if (star.includes(id)) {
            setStar(prev => prev.filter(ele => ele !== id))
        } else {
            setStar(prev => [...prev, id])
        }
    }
    const avatar = localStorage.getItem("email")
    return (
        <div>
            <TopBar />
            <div style={{ display: "flex" }}>
                <Navbar />
                <div style={{ marginLeft: "80px", marginTop: "60px" }}>
                    {message.map((details) => {
                        return (
                            <div className='displaymsg-root'>
                                <Tooltip title={details.message}>
                                    <table className="displaymsg" style={{ width: "130%", cursor: "pointer", backgroundColor: "lightgray" }}>
                                        <Checkbox size='small' />
                                        <Button onClick={() => handleStar(details._id)}> {star.includes(details._id) ? <StarIcon /> : <StarBorderIcon />}</Button>
                                        <Box onClick={() => handleOpen(details)} sx={{display:"flex"}}>

                                        <Typography style={{ width: 200 }} id="from">{details.from}</Typography>
                                        <Typography style={{ width: 200 }} id="subject">{details.subject}</Typography>
                                        <Typography style={{ width: 200 }} id="message">{details.message}</Typography>
                                        </Box>
                                        <Button onClick={() => handleDelete(details)}><DeleteIcon color='inherit' /></Button>
                                    </table>
                                </Tooltip>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex" }}>
                                <Avatar sx={{ bgcolor: deepOrange[500] }}>{avatar[1]}</Avatar>
                                <div style={{ marginLeft: "8px" }}>
                                    <Typography id="modal-modal-title" sx={{ fontSize: "16px" }}>
                                        <b>From:{modal.from}</b>
                                    </Typography>
                                    <Typography id="modal-modal-title" sx={{ fontSize: "16px" }}>
                                        To:{modal.to}
                                    </Typography>
                                </div>


                            </div>
                            <CloseIcon style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => setOpen(false)} />

                        </div>
                        <Box sx={{ backgroundColor: "#C0C0C0", marginTop: "20px" }}>
                            <Typography id="modal-modal-description" variant="h6" component="h2">
                                Sub: <b>{modal.subject}</b>
                            </Typography>
                        </Box>
                        <br /><br />
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={style1}>
                            {modal.message}
                        </Typography>
                        <br />
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                            <Button variant="contained" onClick={() => setOpen(false)}>Close</Button>
                        </div>
                    </Box>



                </Modal>
            </div>
        </div >
    )
}
export default DisplayMsg

