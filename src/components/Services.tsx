import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBrush,
  faCircleDollarToSlot,
  faCode,
  faDesktop,
  faFire,
  faPersonBreastfeeding,
  faServer,
  faShieldHalved,
  IconName,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import servicesJSON from "../data/services.json";

const ServicesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  place-items: center;
  width: 100%;
  height: 100%;
  align-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;
const Styled_Service = styled.div`
  position: relative;
  transform: translate(0px, 0px);
  color: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  height: 250px;
  padding: 10px;
  transition: 0.3s ease;
  width: calc(100% - 1rem);
  
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  animation: serv 3s linear;
  animation-timeline: view(200px 40px);

  @media (max-width: 991px) {
    width: 90%;
  }

  & .icon {
    svg {
      font-size: 1.6rem;
      color: var(--main-color);
      opacity: 0.8;
      transition: 0.3s ease;
    }
  }

  & .title {
    font-size: 1rem;
    text-align: center;
    font-weight: bold;
    color: var(--secondary-color);
  }
  & .explain {
    font-size: 0.6rem;
    line-height: 1.7;
    letter-spacing: 2px;
    opacity: 0.7;
    max-width: 95%;
    text-align: center;
    color: var(--background-white-color);
  }

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.06);
    border-color: var(--main-color);
    box-shadow: 0 10px 30px rgba(var(--main-color-rgb), 0.2);

    & .icon svg {
      transform: scale(1.1);
      opacity: 1;
    }
  }
`;

interface ServiceInterface {
  service: string;
  explain: string;
  icon: IconName;
}

const icons: { [key: string]: IconProp } = {
  faShieldHalved,
  faCode,
  faFire,
  faDesktop,
  faCircleDollarToSlot,
  faBrush,
  faPersonBreastfeeding,
  faServer,
};

const Services = () => {
  const [data, setData] = useState<ServiceInterface[] | []>([]);

  useEffect(() => {
    return setData(servicesJSON as ServiceInterface[]);
  }, []);

  return (
    <ServicesContainer>
      {data &&
        data.map((serv, i) => {
          return (
            <Service
              key={i}
              service={{
                explain: serv.explain,
                service: serv.service,
                icon: serv.icon,
              }}
            />
          );
        })}
    </ServicesContainer>
  );
};

export default Services;

type ServiceProp = {
  service: ServiceInterface;
};

const Service = ({ service }: ServiceProp) => {
  const { t } = useTranslation();

  return (
    <Styled_Service>
      <div>
        <span className="icon">
          <FontAwesomeIcon icon={icons[service.icon]} />
        </span>
      </div>
      <div>
        <h2 className="title">{t(`services.items.${service.service}`)}</h2>
      </div>
      <div>
        <p className="explain">{t(`services.items.${service.explain}`)}</p>
      </div>
    </Styled_Service>
  );
};
