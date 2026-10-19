import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { QualityLevel, getQualityLevel, setQualityLevel as saveQuality, applyQualityClass } from "../utils/quality";

type ContextType = {
  isList: boolean;
  setIsList: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDropdownOpen: boolean;
  registerDropdown: (id: string, isOpen: boolean) => void;
  newProject: boolean;
  setNewProject: React.Dispatch<React.SetStateAction<boolean>>;
  qualityLevel: QualityLevel;
  setQualityLevel: (level: QualityLevel) => void;
};
const Context = createContext<ContextType | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
};

const ContextProvider = ({ children }: ProviderProps) => {
  const [isList, setIsList] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1040);
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [newProject, setNewProject] = useState(false);
  const [qualityLevel, _setQualityLevel] = useState<QualityLevel>(getQualityLevel);

  useEffect(() => {
    applyQualityClass(qualityLevel);
  }, []);

  const setQualityLevel = useCallback((level: QualityLevel) => {
    _setQualityLevel(level);
    saveQuality(level);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1040);
  };

  const registerDropdown = useCallback((id: string, isOpen: boolean) => {
    setOpenDropdowns(prev => {
      const next = new Set(prev);
      if (isOpen) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const isDropdownOpen = openDropdowns.size > 0;

  return (
    <Context.Provider
      value={{
        isList,
        setIsList,
        isMobile,
        setIsMobile,
        isOpen,
        setIsOpen,
        isDropdownOpen,
        registerDropdown,
        newProject,
        setNewProject,
        qualityLevel,
        setQualityLevel,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;

export const useMyContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("use  must be used within A  Provider");
  }
  return context;
};
