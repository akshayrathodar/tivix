import react, { useEffect, useRef, useState } from 'react';
import './home.css';
import { Col , Row , Button , Divider } from 'antd';
import { getAllMinifigs, getMinfigParts, postMyData } from '../api/rebrick';
import PartCard from '../components/partcard';
import { Formik } from 'formik';
import { Form, Input, DatePicker , Select } from 'formik-antd';
import * as yup from 'yup';
import moment from 'moment';
import { ZipCode } from '../utils/zipcodes';
import { toast } from 'react-toastify';

interface IMinfigs {
    last_modified_dt: string,
    name: string,
    num_parts: number,
    set_img_url: string,
    set_num: string,
    set_url: string
}

interface FormSchema {
    name: string,
    surname: string,
    phone: string,
    dob: string,
    email: string,
    address: string,
    zipcode: string,
    state: string,
    city: string
}

const Home = () => {
    
    const [minfigs,setMinfigs] = useState();
    const [currentminfig,setCurrentMinfigs] = useState<IMinfigs>();
    const [currentParts,setCurrentParts] = useState<any>(null);
    const formikRef = useRef<any>(null);
    const today = moment();
    const { Option } = Select;

    const schema = yup.object().shape({
        name: yup.string().required('Please Enter Name.').min(1, "Name is Too short.").max(255, "Name is Too long."),
        surname: yup.string().required('Please Enter Surname.').min(1, "Surname is Too short.").max(255, "Surname is Too long."),
        address: yup.string().required('Please Enter Address.').min(1, "Address is Too short.").max(255, "Address is Too long."),
        city: yup.string().required('Please Enter City.').min(1, "City is Too short.").max(255, "City is Too long."),
        phone: yup.string().required('Please Enter Phone Number').matches(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,'Invalid USA Number'),
        dob: yup.string().required('Please Enter DOB').nullable().test("Is date greater","DOB cannot be greater than today's date",
          (value: any) => {
            if (!value) return true;
            return moment(today).diff(value) > 0;
          }
        ),
        email: yup.string().required('Please Enter Email').email("Email is Not Valid"),
        zipcode: yup.string().required('Please Enter Phone Number').matches(/^\d{5}(?:[-\s]\d{4})?$/g,"Please Use USA Zip Code"),
        state: yup.string().required('Please Select State')
    });

    useEffect(() => {
        if(!minfigs) {
            getMinifigs();
        }
    },[])

    useEffect(() => {
        if(currentminfig) {
            getMinfigParts(currentminfig.set_num).then((resp) => {
                if(resp.data) {
                    setCurrentParts(resp.data);
                }
            })
        }
    },[currentminfig])

    const getMinifigs = () => {
        getAllMinifigs().then((resp) => {
            if(resp && resp.data) {
                let tempfigs = resp.data.results;
                setMinfigs(resp.data.results)
                let currentfig = tempfigs[Math.floor(Math.random()*tempfigs.length)];
                setCurrentMinfigs(currentfig);
            }
        })
    }

    const placeOrderClick = () => {
        if (formikRef.current) {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            formikRef.current.handleSubmit();
        }      
    }

    const successValidated = (payload: FormSchema) => {
        postMyData(payload).then(() => {
            toast.success('Well Done , You Did It');
            getMinifigs();
            formikRef.current.resetForm();
        }).catch((err) => {
            toast.error('Sorry Bro , Its not Working')
        })
    }
    
    return (
        <>
             <Row>
                <Col xs={24} xl={16}>
                    <div className="minifig-container">
                        <h1 className="shipping-head">SHIPPING DETAILS</h1>
                        <Formik
                        innerRef={formikRef}
                        initialValues={{name: '',surname: '',phone: '',dob: '',email: '',address: '',zipcode: '',state: '',city: ''}}
                        validationSchema={schema}
                        onSubmit={(values: FormSchema) => successValidated(values)}
                        render={() => (
                            
                            <Form layout='vertical' colon={false}>
                                <Row>
                                <Col xl={12}>
                                    <Form.Item className="formcontrols" label='Name' name='name' >
                                        <Input name="name" placeholder="Enter Name"/>
                                    </Form.Item>
                                </Col>
                                <Col xl={12}>
                                    <Form.Item className="formcontrols" label='Surname' name='surname' >
                                        <Input name="surname" placeholder="Enter Surname"/>
                                    </Form.Item>
                                </Col>

                                <Col xl={24}>
                                    <Form.Item className="formcontrols" label='Phone Number' name='phone' >
                                        <Input name="phone" placeholder="Enter Phone Number"/>
                                    </Form.Item>
                                </Col>

                                <Col xl={24}>
                                    <Form.Item className="formcontrols" label='Email' name='email' >
                                        <Input name="email" placeholder="Enter Email"/>
                                    </Form.Item>
                                </Col>


                                <Col xl={24}>
                                    <Form.Item className="formcontrols" label='Date Of Birth' name='dob' >
                                        <DatePicker name="dob" className="w-100" />
                                    </Form.Item>
                                </Col>

                                <Col xl={24}>
                                    <Form.Item className="formcontrols" label='Address' name='address' >
                                        <Input name="address" placeholder="Enter Address"/>
                                    </Form.Item>
                                </Col>

                                <Col xl={24}>
                                    <Form.Item className="formcontrols" label='City' name='city' >
                                        <Input name="city" placeholder="Enter City"/>
                                    </Form.Item>
                                </Col>

                                <Col xl={12}>
                                    <Form.Item className="formcontrols" label='State' name='state' >
                                        <Select name="state">
                                            {ZipCode.map((code) => {
                                                return <Option value={code}>{code}</Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xl={12}>
                                    <Form.Item className="formcontrols" label='Zip Code' name='zipcode' >
                                        <Input name="zipcode" placeholder="Enter Zip Code"/>
                                    </Form.Item>
                                </Col>
                                </Row>
                            </Form>
                            
                        )}
                        />

                    </div>
                </Col>
                <Col xs={24} xl={8}>
                    {currentminfig && <div className="minifig-container">
                        <h1>Your MINIFIG</h1>
                        {currentminfig.set_img_url && <>
                        <div className="master-avtar-img">
                            <img src={currentminfig.set_img_url} />
                        </div>
                        <div className="master-avtar-img"><span className="avatar-main-title">{currentminfig.name}</span></div>
                        </>}
                        {currentParts && 
                        <div className="parts-container">
                            <span className="parts-container-count">There Are {currentParts.count} parts in this minifig:</span>
                            {currentParts.results.map((part: any , key: number) => {
                                return <PartCard part={part} key={key}/>
                            })}
                        </div>}
                        <div className="minfig-footer">
                            <Button className="draw-btn" shape="round" size={'large'} onClick={() => {getMinifigs()}}>
                                DRAW AGAIN
                            </Button>
                            <Divider>OR</Divider>
                            <Button className="order-btn" type="primary" shape="round" size={'large'} onClick={() => {placeOrderClick()}} >
                                PLACE AN ORDER
                            </Button>
                        </div>
                    </div>}
                </Col>
             </Row>
        </>
    )
}

export default Home;