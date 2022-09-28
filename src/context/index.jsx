import React, {useContext, createContext} from 'react';
import {useAddress, useContract, useMetamask, useContractWrite} from '@thirdweb-dev/react';
import {ethers} from 'ethers'

const StateContext = createContext();

export const StateContextProvider = ({children}) => {
  const {contract} = useContract('0x4b065d0a1035C659695BF7a112FAf2704138e527');
  const {mutateAsync: createCampaign} = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, //owner
        form.title, //title of the campaign
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image
      ])
      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');
    const parseCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers. utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId:i
    }))

    return parseCampaigns;
  }

  return (
    <StateContext.Provider
      value={{address, contract, connect, createCampaign:publishCampaign, getCampaigns}}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)