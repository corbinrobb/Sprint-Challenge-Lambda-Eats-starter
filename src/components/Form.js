import React, { useState } from 'react';
import axios from 'axios';
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters long').required('Name is required')
})


const Form = () => {
  const [ form, setForm ] = useState({ 
    name: '',
    size: '14',
    toppings: {
      pepperoni: false,
      sausage: false,
      peppers: false,
      olives: false
    },
    instructions: ''
   });

   const [ errors, setErrors ] = useState({
     name: ''
   });

   const [ order, setOrder ] = useState();

   const validate = (e) => {
    yup
      .reach(schema, e.target.name)
      .validate(e.target.value)
      .then(valid => {
        setErrors({
          ...errors,
          [e.target.name]: ''
        })
      })
      .catch(err => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors
        })
      })
   }

   const handleChange = (e) => {
    e.persist();
    if(e.target.type === "checkbox") {
      setForm({
        ...form,
        toppings: {
          ...form.toppings,
          [e.target.name]: e.target.checked
        }
      })
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      })
    }
     if (e.target.name === 'name') validate(e);
   }

   const submitForm = (e) => {
    e.preventDefault();

    const processedForm = {
      ...form,
      toppings: Object.keys(form.toppings).filter(topping => form.toppings[topping])
    }

     axios
       .post('https://reqres.in/api/users', processedForm)
       .then(res => {
         setOrder(res.data);
         setForm({
           name: '',
           size: '14',
           toppings: {
             pepperoni: false,
             sausage: false,
             peppers: false,
             olives: false
           },
           instructions: ''
         });
       })
   }

  return (
    <form onSubmit={submitForm}>
      <label>
        Name for Order
        <input 
          name="name"
          value={form.name}
          onChange={handleChange}
         />
      </label>
      {errors.name && <p>{errors.name}</p>}
      <label>
        Size:
        <select
          name="size"
          value={form.size}
          onChange={handleChange}
        >
          <option value="14">14"</option>
          <option value="16">16"</option>
          <option value="18" >18"</option>
        </select>
      </label>
      <label>
        Pepperoni
        <input
          name="pepperoni"
          type="checkbox"
          checked={form.toppings.pepperoni}
          onChange={handleChange}
        />
      </label>
      <label>
        Sausage
        <input
          name="sausage"
          type="checkbox"
          checked={form.toppings.sausage}
          onChange={handleChange}
        />
      </label>
      <label>
        Peppers
        <input
          name="peppers"
          type="checkbox"
          checked={form.toppings.peppers}
          onChange={handleChange}
        />
      </label>
      <label>
        Olives
        <input
          name="olives"
          type="checkbox"
          checked={form.toppings.olives}
          onChange={handleChange}
        />
      </label>
      <label>
        Special Instructions
        <input
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
        />
      </label>
      <button>Order Pizza!</button>

      {order && <pre >{JSON.stringify(order, null, 2)}</pre>}
    </form>
  );
}

export default Form;