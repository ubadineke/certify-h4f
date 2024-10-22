import { ethers } from 'hardhat';

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account:', deployer.address);

    const nftFactory = await ethers.getContractFactory('MyNFT');
    // Pass the deployer's address as the initialOwner
    const nft = await nftFactory.deploy(deployer.address);

    await nft.waitForDeployment();

    const address = await nft.getAddress();
    console.log('NFT Contract Deployed at:', address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
