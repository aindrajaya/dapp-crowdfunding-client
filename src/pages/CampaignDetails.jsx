import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CustomButton, CountBox } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import {thirdweb} from '../assets';

const CampaignDetails = () => {
  const {state} = useLocation();
  console.log(state, "data from another page");
  const {donate, getDonations, contract, address} = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId)
    setDonators(data);
  }

  const handleDonate = async () => {
    setIsLoading(true);
    await donate(state.pId, amount);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])

  return (
    <div>
      {isLoading && 'Loading...'}
      <div className='w-full flex md:flex-row flex-col mt-10 gap-[30px]'>
        <div className='flex-1 flex-col'>
          <img src={state.image} alt='campaign' className='w-full h-[410px] object-cover rounded-xl'/>
          <div className='relative w-full h-[5px] bg-[#3aea43] mt-2'>
            <div className='absolute h-full bg-[#4acd8d]' style={{widhth: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}}>
            </div>
          </div>
        </div>
        <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30p]x'>
          <CountBox title="Days Left" value={remainingDays}/>
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected}/>
          <CountBox title='Total Backers' value={donators.length}/>
        </div>
      </div>

      {/* Rest of the content */}
      <div className='mt-[60px] flex lg:flex-row flex-col gap-5'>
        <div className='flex-[2] flex flex-col gap-[40px]'>
          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Creator</h4>
            <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px]'>
              <div className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer'>
                <img src={thirdweb} alt='user' className='w-[60%] h-[60%] object-contain'/>
              </div>
              <div>
                <h4 className='font-epilogue font-semibold text-[14px] text-white break-all'>{state.owner}</h4>
                <p className='mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]'>Any Campaigns</p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div>
           <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Story</h4>
           <div className='mt-[20px]'>
            <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>
              {state.description}
            </p>
           </div>
          </div>

          {/* Donators */}
          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Donators</h4>
            <div className='mt-[20px] flex flex-col gap-4'>
              {donators.length > 0 ? donators.map((person, idx)=> (
                <div>
                  {person + idx}
                </div>
              )) : (
                <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>No donators yet, be the first one!</p>
              )}
            </div>
          </div>
        </div>
        {/* Button donate */}
        <div className='flex-1'>
          <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Fund</h4>
          <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]'>
            <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>Fund the campaign</p>
            <div className='mt-[30px]'>
              <input 
                type='number'
                placeholder='ETH 0.1'
                step='0.01'
                className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3aea43] bg-transparent font-epilogue text-white text-[18px] leading-[30ox] placeholder:text-[#4b5264] rounded-[10px]'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className='my-[20px] p-4 bg-[#13131a] rounded-[10px]'>
                <h4 className='font-epilogue font-semibold text-[14px] leading-[22px] text-white'>Back it because you believe it</h4>
                <p className='mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]'>Your help is very precious for us to make the better future and great experience</p>
              </div>

              <CustomButton 
                btnType='button'
                title='Fund Campaign'
                styles='w-full bg-[#8c6dfd]'
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails