import { BVS_CONTRACT } from '@global/constants/blockchain';
import { useInfoContext } from '@hooks/context/infoContext/InfoContext';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import connectToContract from '@hooks/contract/connectToContract';
import detectEthereumProvider from '@metamask/detect-provider';

const useHandleConnectMetamask = () => {
  const { userState, setUserState } = useUserContext();
  const { alerts, setAlerts } = useInfoContext();

  const handleConnectMetamask = async (): Promise<boolean> => {
    try {
      // const account = ((await sdk?.connect()) as any[])?.[0];
      const ethereum = (await detectEthereumProvider()) as any;

      const account = (
        await ethereum?.request({
          method: 'eth_accounts'
        })
      )?.[0];

      const chainId = Number(
        ((await ethereum?.request({
          method: 'eth_chainId'
        }) || '') as string
        )
      );

      if (chainId !== BVS_CONTRACT.chainId) {
        setAlerts({
          ...alerts,
          incorrectChainId: {
            severity: 'error',
            text: `Wrong chain id! Connect to: ${BVS_CONTRACT.chainId}`
          }
        });

        setUserState({
          ...userState,
          walletAddress: account,
          chainId
        });
        return false;
      }
      if (alerts.incorrectChainId) {
        delete alerts.incorrectChainId;
        setAlerts({
          ...alerts
        });
      }

      let contract;

      try {
        contract = await connectToContract(ethereum);

        if ((await contract.getDeployedCode()) === null) {
          contract = undefined;
          throw new Error('No contract found');
        } else {
          delete alerts.failedContractConnection;
          setAlerts({
            ...alerts
          });
        }
      } catch (err: any) {
        console.log('error', err);
        setAlerts({
          ...alerts,
          failedContractConnection: {
            severity: 'error',
            text: `Something went wrong with BVS_Voting smart contract connection: ${err}`
          }
        });
      }

      setUserState({
        ...userState,
        walletAddress: account,
        contract,
        chainId
      });

      return true;
    } catch (err) {
      console.warn('failed to connect..', err);
    }
    return false;
  };

  return {
    handleConnectMetamask
  };
};

export default useHandleConnectMetamask;
