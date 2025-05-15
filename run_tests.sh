test:
  stage: test
  script:
    - chmod +x ./run_tests.sh
    - ./run_tests.sh
